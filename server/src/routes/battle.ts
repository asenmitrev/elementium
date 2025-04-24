import express, { Router, Request, Response } from "express";
import { battle } from "../battleLogic/battle";
import { Hero } from "../models/hero.model";
import { predefinedNeutrals } from "../predefined/neutrals";
import { authenticateToken } from "../middleware/auth";
import { BattleResult } from "../models/battleResult.model";
import { Unit } from "../models/unit.model";
import { Land } from "types";
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
      attackerDeck: predefinedNeutrals.units.map((unit) => unit),
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
  const { attackerHeroId, defenderHeroId } = req.body;
  const attackerHero = await Hero.findById(attackerHeroId);
  const defenderHero = await Hero.findById(defenderHeroId);
  if (!attackerHero || !defenderHero) {
    res.status(404).json({ error: "Hero not found" });
    return;
  }
  console.log(attackerHero?.player, defenderHero?.player);
  const attackerUnits = await Unit.find({ holder: attackerHero!._id });
  const defenderUnits = await Unit.find({ holder: defenderHero!._id });
  const battleResult = await battle({
    attackerDeck: attackerUnits.map((unit) => unit.type),
    defenderDeck: defenderUnits.map((unit) => unit.type),
    attackerGraveyard: [],
    defenderGraveyard: [],
    attackerHeroTypeUserFacing: attackerHero.type,
    defenderHeroTypeUserFacing: defenderHero.type,
    defenderCastle: predefinedNeutrals,
    land: ["earth", "fire", "water"][Math.floor(Math.random() * 3)] as Land,
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
