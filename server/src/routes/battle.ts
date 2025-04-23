import express, { Router, Request, Response } from "express";
import { battle } from "../battleLogic/battle";
import { Hero } from "../models/hero.model";
import { predefinedNeutrals } from "../predefined/neutrals";
import { authenticateToken } from "../middleware/auth";
import { BattleResult } from "../models/battleResult.model";
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

router.get(
  "/:battleId",
  authenticateToken,
  async (req: Request, res: Response) => {
    const battle = await BattleResult.findOne({
      _id: req.params.battleId,
      player: req.user!.userId,
    });
    if (!battle) {
      res.status(404).json({ error: "Battle not found" });
      return;
    }
    res.json(battle);
  }
);
export default router;
