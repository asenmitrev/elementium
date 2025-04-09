import express, { Request, Response, Router } from "express";
import { Hero } from "../models/hero.model";
import { authenticateToken } from "../middleware/auth";
import { Hero as IHero, UnitType } from "types";
import { heroes } from "../predefined/heroes";
const router: Router = express.Router();

// Get all heroes for a user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.find({ player: req.user!.id });
    res.json(heroes);
  } catch (error) {
    console.error("Error fetching heroes:", error);
    res.status(500).json({ error: "Error fetching heroes" });
  }
});

router.get(
  "/predefined-units",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      res.json(heroes);
    } catch (error) {
      console.error("Error fetching units:", error);
      res.status(500).json({ error: "Error fetching units" });
    }
  }
);

router.post(
  "/predefined-units",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { heroId } = req.body;
      const hero = heroes.find((hero) => hero._id === heroId);
      if (!hero) {
        res.status(404).json({ error: "Hero not found" });
        return;
      }
      const { _id, units, ...newHeroFromTemplate } = {
        ...hero,
        player: req.user!.userId,
      };
      const newHero = new Hero(newHeroFromTemplate);
      await newHero.save();
      res.status(201).json(newHero);
    } catch (error) {
      console.error("Error creating hero:", error);
      res.status(500).json({ error: "Error creating hero" });
    }
  }
);

// Get specific hero
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findOne({
      _id: req.params.id,
      player: req.user!.id,
    });

    if (!hero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }

    res.json(hero);
  } catch (error) {
    console.error("Error fetching hero:", error);
    res.status(500).json({ error: "Error fetching hero" });
  }
});

// Create new hero
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type, x, y, units } = req.body;

    const hero = new Hero({
      type,
      x,
      y,
      units,
      player: req.user!.id,
    });

    await hero.save();
    res.status(201).json(hero);
  } catch (error) {
    console.error("Error creating hero:", error);
    res.status(500).json({ error: "Error creating hero" });
  }
});

// Update hero
router.patch("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findOneAndUpdate(
      { _id: req.params.id, player: req.user!.id },
      { $set: req.body },
      { new: true }
    );

    if (!hero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }

    res.json(hero);
  } catch (error) {
    console.error("Error updating hero:", error);
    res.status(500).json({ error: "Error updating hero" });
  }
});

// Assign mission to hero
router.post(
  "/:id/mission",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { destinationX, destinationY, travelTime } = req.body;

      const hero = await Hero.findOneAndUpdate(
        {
          _id: req.params.id,
          player: req.user!.id,
          alive: true,
          mission: null, // Only allow assigning mission if hero isn't already on one
        },
        {
          $set: {
            mission: {
              destinationX,
              destinationY,
              travelTime: new Date(travelTime),
            },
          },
        },
        { new: true }
      );

      if (!hero) {
        res
          .status(404)
          .json({ error: "Hero not found or unavailable for mission" });
        return;
      }

      res.json(hero);
    } catch (error) {
      console.error("Error assigning mission:", error);
      res.status(500).json({ error: "Error assigning mission" });
    }
  }
);

// Delete hero (might want to disable this and just use 'alive: false' instead)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const hero = await Hero.findOneAndUpdate(
        { _id: req.params.id, player: req.user!.id },
        { $set: { alive: false } },
        { new: true }
      );

      if (!hero) {
        res.status(404).json({ error: "Hero not found" });
        return;
      }

      res.json({ message: "Hero marked as deceased" });
    } catch (error) {
      console.error("Error removing hero:", error);
      res.status(500).json({ error: "Error removing hero" });
    }
  }
);

export default router;
