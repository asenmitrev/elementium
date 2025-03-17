import express, { Request, Response, Router } from "express";
import { Castle } from "../models/castle.model";
import { authenticateToken } from "../middleware/auth";

const router: Router = express.Router();

// Get all castles for a user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    // We know user exists because of authenticateToken middleware
    const castles = await Castle.find({ owner: req.user!.id });
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
      owner: req.user!.id,
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

// Create new castle
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { x, y, type, isCapital } = req.body;

    // Check if coordinates are already taken
    const existingCastle = await Castle.findOne({ x, y });
    if (existingCastle) {
      res.status(400).json({ error: "Location already occupied" });
      return;
    }

    const castle = new Castle({
      x,
      y,
      type,
      isCapital,
      owner: req.user!.id,
      buildings: {
        walls: { level: 1 },
        moat: { level: 1 },
        magicShield: { level: 1 },
        towers: { level: 1 },
        mine: { level: 1 },
        soldierGuild: { level: 1 },
        heroGuild: { level: 1 },
        spyGuild: { level: 1 },
        counterEspionageGuild: { level: 1 },
        altar: { level: 1 },
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
      { _id: req.params.id, owner: req.user!.id },
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
        owner: req.user!.id,
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
