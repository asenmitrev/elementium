import express, { Request, Response, Router } from "express";
import { Hero } from "../models/hero.model";
import { authenticateToken } from "../middleware/auth";
import { predefinedHeroTypes } from "../predefined/heroes";
import { Castle } from "../models/castle.model";
import { ObjectId } from "mongodb";
import { Unit } from "../models/unit.model";
import { Unit as IUnit } from "types";
import { predefinedNeutrals } from "../predefined/neutrals";

const router: Router = express.Router();

// Get all heroes for a user
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.aggregate([
      {
        $match: { player: new ObjectId(req.user!.userId) },
      },
      {
        $lookup: {
          from: "units",
          localField: "_id",
          foreignField: "holder",
          as: "units",
        },
      },
      {
        $addFields: {
          units: { $sortArray: { input: "$units", sortBy: { order: 1 } } },
        },
      },
    ]).exec();
    res.json(heroes);
  } catch (error) {
    console.error("Error fetching heroes:", error);
    res.status(500).json({ error: "Error fetching heroes" });
  }
});

// Get all heroes for a user
router.get("/map", authenticateToken, async (req: Request, res: Response) => {
  try {
    const heroes = await Hero.aggregate([
      {
        $match: { player: { $ne: new ObjectId(req.user!.userId) } },
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
    console.error("Error fetching heroes:", error);
    res.status(500).json({ error: "Error fetching heroes" });
  }
});

router.get(
  "/predefined-units",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      res.json(predefinedHeroTypes);
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
      const userHeroCount = await Hero.countDocuments({
        player: new ObjectId(req.user!.userId),
      });
      if (userHeroCount > 0) {
        res.status(400).json({
          error:
            "You already have a hero, please skip the tutorial or contact an admin.",
        });
        return;
      }
      const castle = await Castle.findOne({
        owner: new ObjectId(req.user!.userId),
      });
      if (!castle) {
        res.status(404).json({ error: "Castle not found" });
        return;
      }
      const { heroName } = req.body;
      const heroType = predefinedHeroTypes.find(
        (hero) => hero.name === heroName
      );

      if (!heroType) {
        res.status(404).json({ error: "Hero Type not found" });
        return;
      }
      const newHero = new Hero({
        type: heroType,
        player: req.user!.userId,
        name: heroName,
        x: castle.x,
        y: castle.y,
        level: 0,
        experienceTillLevelUp: 100,
        mission: null,
        alive: true,
      });

      await newHero.save();
      const units: Partial<IUnit>[] = heroType.units.map((unit) => ({
        ...unit,
        holder: newHero._id,
        holderModel: "Hero",
        experienceTillLevelUp: 100,
        player: req.user!.userId,
      }));
      await Unit.insertMany(units);
      res.status(201).json(newHero);
    } catch (error) {
      console.error("Error creating hero:", error);
      res.status(500).json({ error: "Error creating hero" });
    }
  }
);

router.get(
  "/onboarding-neutrals",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const neutrals = predefinedNeutrals;
      res.json(neutrals);
    } catch (error) {
      console.error("Error fetching neutrals:", error);
      res.status(500).json({ error: "Error fetching neutrals" });
    }
  }
);
// Get specific hero
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findOne({
      _id: req.params.id,
      player: req.user!.userId,
    }).populate({
      path: "units",
      options: { sort: { order: 1 } },
    });
    if (!hero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }

    const units = await Unit.find({ holder: hero!._id });
    hero.units = units.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    console.log(hero.units);
    res.json(hero);
  } catch (error) {
    console.error("Error fetching hero:", error);
    res.status(500).json({ error: "Error fetching hero" });
  }
});

// Update hero
router.patch("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const hero = await Hero.findOneAndUpdate(
      { _id: req.params.id, player: req.user!.userId },
      { $set: req.body },
      { new: true }
    ).populate({
      path: "units",
      options: { sort: { order: 1 } },
    });

    if (!hero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }

    const units = await Unit.find({ holder: hero._id });
    hero.units = units.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
