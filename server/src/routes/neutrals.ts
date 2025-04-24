import express, { Request, Response, Router } from "express";
import { Hero } from "../models/hero.model";
import { authenticateToken } from "../middleware/auth";
import { predefinedHeroTypes } from "../predefined/heroes";
import { Castle } from "../models/castle.model";
import { ObjectId } from "mongodb";
import { Unit } from "../models/unit.model";
import { Unit as IUnit } from "types";
import { predefinedNeutrals } from "../predefined/neutrals";
import { UnitRaceData, unitRaces } from "types/unitRaces";
import {
  createHeroType,
  createUnitType,
} from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";

const router: Router = express.Router();

const heroUnits = Array.from({ length: 3 }, () => {
  const unitType = createUnitType();
  return unitType;
});

console.log(JSON.stringify(heroUnits, null, 2));

// Get all heroes for a user
router.get("/create-neutrals", async (req: Request, res: Response) => {
  try {
    const allRaces = [...unitRaces.values()];
    const randomRace = allRaces[Math.floor(Math.random() * allRaces.length)];
    const heroType = createHeroType(randomRace);
    const newHero = new Hero({
      type: heroType,
      name: heroType.name,
      x: Math.floor(Math.random() * 100) + 1,
      y: Math.floor(Math.random() * 100) + 1,
      level: 0,
      experienceTillLevelUp: 100,
      mission: null,
      alive: true,
    });
    await newHero.save();

    const unitTypes = Array.from({ length: 3 }, () => {
      const unitType = createUnitType();
      return unitType;
    });

    const units: IUnit[] = unitTypes.map((unit) => ({
      holder: newHero._id,
      holderModel: "Hero",
      experienceTillLevelUp: 100,
      type: unit,
    }));
    await Unit.insertMany(units);

    res.status(201).json({ hero: newHero, units });
  } catch (error) {
    console.error("Error creating neutrals:", error);
    res.status(500).json({ error: "Error fetching neutrals" });
  }
});

export default router;
