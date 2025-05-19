import express, { Router, Request, Response } from "express";
import { battle } from "../battleLogic/battle";
import { Hero } from "../models/hero.model";
import { predefinedNeutrals } from "../predefined/neutrals";
import { authenticateToken } from "../middleware/auth";
import { BattleResult } from "../models/battleResult.model";
import { Unit } from "../models/unit.model";
import { Land } from "types";
import {
  createHeroType,
  createUnitType,
} from "../unitAndHeroGenerationLogic/unitAndHeroGeneration";
import { unitRaces } from "types/unitRaces";
const router: Router = express.Router();

router.post(
  "/onboarding-neutral",
  authenticateToken,
  async (req: Request, res: Response) => {
    const hero = await Hero.findOne({ player: req.user!.userId });
    if (!hero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }
    const units = await Unit.find({ holder: hero!._id });
    hero.units = units;
    const existingBattles = await BattleResult.find({
      $or: [
        { playerAttacker: req.user!.userId },
        { playerDefender: req.user!.userId },
      ],
    });
    if (existingBattles.length > 0) {
      res.status(400).json({ error: "You already have a battle" });
      return;
    }

    const battleResult = await battle({
      defenderDeck: hero.units?.map((unit) => unit.type) ?? [],
      attackerDeck: predefinedNeutrals.units.map((unit) => unit.type),
      attackerGraveyard: [],
      defenderGraveyard: [],
      defenderHeroTypeUserFacing: hero.type,
      attackerHeroTypeUserFacing: predefinedNeutrals,
      defenderCastle: predefinedNeutrals,
      land: "fire",
    });

    const newBattle = new BattleResult({
      ...battleResult,
      playerDefender: req.user!.userId,
      defender: hero._id,
    });
    await newBattle.save();

    res.json(newBattle);
  }
);

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const { attackerHeroId, defenderHeroId, terrain } = req.body;
  const attackerHero = await Hero.findById(attackerHeroId);
  const defenderHero = await Hero.findById(defenderHeroId);
  if (!attackerHero || !defenderHero) {
    res.status(404).json({ error: "Hero not found" });
    return;
  }
  const attackerUnits = await Unit.find({ holder: attackerHero!._id });
  const defenderUnits = await Unit.find({ holder: defenderHero!._id });

  // Map the terrain from client to the Land type
  let landType: Land;
  if (terrain === "water") {
    landType = "water";
  } else if (terrain === "fire") {
    landType = "fire";
  } else {
    // Default to earth for any other value or if no terrain is provided
    landType = "earth";
  }
  console.log("Land type:", landType, terrain);
  const battleResult = await battle({
    attackerDeck: attackerUnits.map((unit) => unit.type),
    defenderDeck: defenderUnits.map((unit) => unit.type),
    attackerGraveyard: [],
    defenderGraveyard: [],
    attackerHeroTypeUserFacing: attackerHero.type,
    defenderHeroTypeUserFacing: defenderHero.type,
    defenderCastle: predefinedNeutrals,
    land: landType,
  });
  const newBattle = new BattleResult({
    ...battleResult,
    playerAttacker: attackerHero.player,
    playerDefender: defenderHero.player,
    defender: defenderHero._id,
    attacker: attackerHero._id,
  });
  await newBattle.save();
  res.json(newBattle);
});

router.post(
  "/map-battle",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { defenderHeroId, terrain } = req.body;

    // 25% chance of battle
    if (Math.random() >= 0.25) {
      res.json({ battleOccurred: false });
      return;
    }

    // Find the attacker's hero and units
    const defenderHero = await Hero.findById(defenderHeroId);
    if (!defenderHero) {
      res.status(404).json({ error: "Hero not found" });
      return;
    }
    const defenderUnits = await Unit.find({ holder: defenderHero!._id });

    // Generate a random neutral hero and units
    const allRaces = [...unitRaces.values()];
    const randomRace = allRaces[Math.floor(Math.random() * allRaces.length)];
    const neutralHeroType = createHeroType(randomRace);
    const neutralUnits = Array.from({ length: 3 }, () =>
      createUnitType(randomRace)
    );

    // Map the terrain from client to the Land type
    let landType: Land;
    if (terrain === "water") {
      landType = "water";
    } else if (terrain === "fire") {
      landType = "fire";
    } else {
      // Default to earth for any other value or if no terrain is provided
      landType = "earth";
    }

    const battleResult = await battle({
      attackerDeck: neutralUnits,
      defenderDeck: defenderUnits.map((unit) => unit.type),
      attackerGraveyard: [],
      defenderGraveyard: [],
      attackerHeroTypeUserFacing: neutralHeroType,
      defenderHeroTypeUserFacing: defenderHero.type,
      defenderCastle: predefinedNeutrals,
      land: landType,
    });

    const newBattle = new BattleResult({
      ...battleResult,
      playerAttacker: null, // No player for neutral
      playerDefender: defenderHero.player,
      defender: defenderHero._id,
      attacker: null, // No attacker hero document
    });
    await newBattle.save();

    res.json({ battleOccurred: true, battle: newBattle });
  }
);

router.get(
  "/:battleId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const battle = await BattleResult.findOne({
      _id: req.params.battleId,
      $or: [
        { playerAttacker: req.user!.userId },
        { playerDefender: req.user!.userId },
      ],
    });
    if (!battle) {
      res.status(404).json({ error: "Battle not found" });
      return;
    }
    res.json(battle);
  }
);
export default router;
