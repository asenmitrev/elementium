import express from "express";
import { TokenService } from "../auth/token.service";

const router = express.Router();
const tokenService = new TokenService();

router.post("/login", async (req, res) => {
  try {
    // TODO: Add actual user authentication logic here
    // This is just a mock user for demonstration
    const user = {
      id: 1,
      email: req.body.email,
    };

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default router;
