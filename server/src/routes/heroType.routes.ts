import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { isAdmin } from "../middleware/admin";
import { HeroType } from "../models/heroType.model";

const router = express.Router();

// Get all hero types (public)
router.get("/", async (req, res) => {
  try {
    const heroTypes = await HeroType.find();
    res.json(heroTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero types", error });
  }
});

// Get single hero type (public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const heroType = await HeroType.findById(req.params.id);
    if (!heroType) {
      res.status(404).json({ message: "Hero type not found" });
      return;
    }
    res.json(heroType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero type", error });
  }
});

// Create hero type (admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const heroType = new HeroType(req.body);
    await heroType.save();
    res.status(201).json(heroType);
  } catch (error) {
    res.status(400).json({ message: "Error creating hero type", error });
  }
});

// Update hero type (admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const heroType = await HeroType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!heroType) {
      res.status(404).json({ message: "Hero type not found" });
      return;
    }
    res.json(heroType);
  } catch (error) {
    res.status(400).json({ message: "Error updating hero type", error });
  }
});

// Delete hero type (admin only)
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const heroType = await HeroType.findByIdAndDelete(req.params.id);
      if (!heroType) {
        res.status(404).json({ message: "Hero type not found" });
        return;
      }
      res.json({ message: "Hero type deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting hero type", error });
    }
  }
);

export default router;
