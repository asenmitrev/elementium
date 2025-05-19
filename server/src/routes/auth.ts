import express, { Request, Response, Router } from "express";
import { TokenService } from "../auth/token.service";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/auth";
import { Hero } from "../models/hero.model";
import { Castle } from "../models/castle.model";
import { BattleResult } from "../models/battleResult.model";
import { ObjectId } from "mongodb";
dotenv.config();

const router: Router = express.Router();
const tokenService = new TokenService();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find user by email
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate tokens
    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
    });
    const refreshToken = tokenService.generateRefreshToken({
      id: user._id,
      email: user.email,
    });

    // Set cookies
    res.status(201).json({
      userId: user._id,
      accessToken: {
        token: accessToken,
        expiresIn: 14 * 60 * 1000,
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: 30 * 24 * 60 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        error:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate tokens
    const accessToken = tokenService.generateAccessToken({
      id: user._id,
      email: user.email,
    });
    const refreshToken = tokenService.generateRefreshToken({
      id: user._id,
      email: user.email,
    });

    res.status(201).json({
      userId: user._id,
      accessToken: {
        token: accessToken,
        expiresIn: 15 * 60 * 1000,
      },
      refreshToken: {
        token: refreshToken,
        expiresIn: 30 * 24 * 60 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Error creating user",
    });
  }
});

router.post("/logout", (req: Request, res: Response): void => {
  // Clear both cookies
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
  });

  res.json({ message: "Logged out successfully" });
});

router.get(
  "/me",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    // If we get here, the user is authenticated (middleware validated the token)
    try {
      const castleCount = await Castle.countDocuments({
        owner: req.user!.userId,
      });
      const heroCount = await Hero.countDocuments({
        player: new ObjectId(req.user!.userId),
      });
      const battleCount = await BattleResult.countDocuments({
        $or: [
          { playerAttacker: req.user!.userId },
          { playerDefender: req.user!.userId },
        ],
      });

      let onboardingStep: number = -1;

      if (castleCount === 0) {
        onboardingStep = 0;
      } else if (heroCount === 0) {
        onboardingStep = 1;
      } else if (battleCount === 0) {
        onboardingStep = 2;
      }
      res.json({
        onboardingStep,
      });
      return;
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
    res.json({ isAuthenticated: true });
  }
);

router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token is required" });
      return;
    }

    // Verify the refresh token
    try {
      const payload = tokenService.verifyToken(refreshToken);

      // Check if token is a refresh token
      if (payload.type !== "refresh") {
        res.status(401).json({ error: "Invalid token type" });
        return;
      }

      // Find the user
      const user = await User.findById(payload.userId);
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      // Generate new tokens
      const newAccessToken = tokenService.generateAccessToken({
        id: user._id,
        email: user.email,
      });

      const newRefreshToken = tokenService.generateRefreshToken({
        id: user._id,
        email: user.email,
      });

      // Return new tokens
      res.status(200).json({
        userId: user._id,
        accessToken: {
          token: newAccessToken,
          expiresIn: 14 * 60 * 1000,
        },
        refreshToken: {
          token: newRefreshToken,
          expiresIn: 30 * 24 * 60 * 60 * 1000,
        },
      });
    } catch (error) {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "An error occurred during token refresh" });
  }
});

export default router;
