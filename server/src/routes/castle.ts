import express, { Request, Response, Router } from "express";
import { Castle } from "../models/castle.model";
import { Hero } from "../models/hero.model";
import { authenticateToken } from "../middleware/auth";
import { ObjectId } from "mongodb";

const router: Router = express.Router();

// Get all castles for a user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // We know user exists because of authenticateToken middleware
    const castles = await Castle.find({ owner: req.user!.userId });
    res.json(castles);
  } catch (error) {
    console.error("Error fetching castles:", error);
    res.status(500).json({ error: "Error fetching castles" });
  }
});

// Get specific castle
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const castle = await Castle.findOne({
      _id: req.params.id,
      owner: req.user!.userId,
    });

    if (!castle) {
      res.status(404).json({ error: "Castle not found" });
      return;
    }

    res.json(castle);
  } catch (error) {
    console.error("Error fetching castle:", error);
    res.status(500).json({ error: "Error fetching castle" });
  }
});

// Get all heroes in a castle
router.get(
  "/:id/heroes",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const castle = await Castle.findOne({
        _id: new ObjectId(req.params.id),
        owner: new ObjectId(req.user!.userId),
      });

      if (!castle) {
        res.status(404).json({ error: "Castle not found" });
        return;
      }

      const heroes = await Hero.aggregate([
        {
          $match: {
            player: new ObjectId(req.user!.userId),
            x: castle.x,
            y: castle.y,
          },
        },
        {
          $lookup: {
            from: "units",
            localField: "_id",
            foreignField: "holder",
            as: "units",
          },
        },
      ]).exec();

      res.json(heroes);
    } catch (error) {
      console.error("Error fetching castle heroes:", error);
      res.status(500).json({ error: "Error fetching castle heroes" });
    }
  }
);

function generateValidCoordinates(
  existingCastles: any[]
): { x: number; y: number } | null {
  // Maximum attempts to find valid coordinates
  const MAX_ATTEMPTS = 50;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Generate coordinates between -1000 and 1000
    // but at least 100 units from center
    const sign = () => (Math.random() < 0.5 ? -1 : 1);
    const x = sign() * (Math.floor(Math.random() * 900) + 100); // 100 to 1000
    const y = sign() * (Math.floor(Math.random() * 900) + 100);

    // Check distance from center
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    if (distanceFromCenter < 100) continue;

    // Check distance from other castles
    const isTooClose = existingCastles.some((castle) => {
      const distance = Math.sqrt(
        Math.pow(castle.x - x, 2) + Math.pow(castle.y - y, 2)
      );
      return distance < 100;
    });

    if (!isTooClose) {
      return { x, y };
    }
  }

  return null; // Could not find valid coordinates
}

// Create new castle
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type } = req.body;

    // Validate element type
    if (!["fire", "water", "earth"].includes(type)) {
      res.status(400).json({ error: "Invalid element type" });
      return;
    }

    // Check if user already has a capital
    const existingCapital = await Castle.findOne({
      owner: req.user!.userId,
      isCapital: true,
    });

    if (existingCapital) {
      res.status(400).json({ error: "User already has a capital castle" });
      return;
    }

    // Find all existing castles
    const allCastles = await Castle.find({});

    // Generate valid coordinates
    const coordinates = generateValidCoordinates(allCastles);

    if (!coordinates) {
      res.status(503).json({
        error: "Could not find valid castle location. Please try again later.",
      });
      return;
    }

    const castle = new Castle({
      x: coordinates.x,
      y: coordinates.y,
      type,
      isCapital: true,
      owner: req.user!.userId,
      buildings: {
        walls: { level: 1, type: "walls", cost: 100 },
        moat: { level: 1, type: "moat", cost: 100 },
        magicShield: { level: 1, type: "magicShield", cost: 100 },
        towers: { level: 1, type: "towers", cost: 100 },
        mine: { level: 1, type: "mine", cost: 100 },
        soldierGuild: { level: 1, type: "soldierGuild", cost: 100 },
        heroGuild: { level: 1, type: "heroGuild", cost: 100 },
        spyGuild: { level: 1, type: "spyGuild", cost: 100 },
        counterEspionageGuild: {
          level: 1,
          type: "counterEspionageGuild",
          cost: 100,
        },
        altar: { level: 1, type: "altar", cost: 100 },
      },
    });

    await castle.save();
    res.status(201).json(castle);
  } catch (error) {
    console.error("Error creating castle:", error);
    res.status(500).json({ error: "Error creating castle" });
  }
});

// Update castle
router.patch("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const castle = await Castle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user!.userId },
      { $set: req.body },
      { new: true }
    );

    if (!castle) {
      res.status(404).json({ error: "Castle not found" });
      return;
    }

    res.json(castle);
  } catch (error) {
    console.error("Error updating castle:", error);
    res.status(500).json({ error: "Error updating castle" });
  }
});

// Delete castle
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const castle = await Castle.findOneAndDelete({
        _id: req.params.id,
        owner: req.user!.userId,
        isCapital: false, // Prevent deletion of capital
      });

      if (!castle) {
        res
          .status(404)
          .json({ error: "Castle not found or cannot be deleted" });
        return;
      }

      res.json({ message: "Castle deleted successfully" });
    } catch (error) {
      console.error("Error deleting castle:", error);
      res.status(500).json({ error: "Error deleting castle" });
    }
  }
);

export default router;
