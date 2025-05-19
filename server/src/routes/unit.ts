import express, { Request, Response, Router } from "express";
import { Unit } from "../models/unit.model";
import { authenticateToken } from "../middleware/auth";
import { Hero } from "../models/hero.model";
import { Castle } from "../models/castle.model";
import { ObjectId } from "mongodb";

const router: Router = express.Router();

// Get all units for a holder (castle or hero)
router.get(
  "/holder/:holderId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const units = await Unit.find({ holder: req.params.holderId });
      res.json(units);
    } catch (error) {
      console.error("Error fetching units:", error);
      res.status(500).json({ error: "Error fetching units" });
    }
  }
);

// Get specific unit
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const unit = await Unit.findById(req.params.userId).populate("holder");

    if (!unit) {
      res.status(404).json({ error: "Unit not found" });
      return;
    }

    // Verify ownership through holder
    const holder = unit.holder;
    if (
      (holder instanceof Hero &&
        holder.player.toString() !== req.user!.userId) ||
      (holder instanceof Castle && holder.owner.toString() !== req.user!.userId)
    ) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    res.json(unit);
  } catch (error) {
    console.error("Error fetching unit:", error);
    res.status(500).json({ error: "Error fetching unit" });
  }
});

// Create new unit
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { type, holderId, holderModel } = req.body;

    // Verify holder ownership
    let holder;
    if (holderModel === "Hero") {
      holder = await Hero.findOne({ _id: holderId, player: req.user!.id });
    } else {
      holder = await Castle.findOne({ _id: holderId, owner: req.user!.id });
    }

    if (!holder) {
      res.status(404).json({ error: "Holder not found or not owned by user" });
      return;
    }

    const unit = new Unit({
      type,
      holder: holderId,
      holderModel,
    });

    await unit.save();

    // Update holder's units array
    if (holderModel === "Hero") {
      await Hero.findByIdAndUpdate(holderId, { $push: { units: unit._id } });
    } else {
      await Castle.findByIdAndUpdate(holderId, {
        $push: { soldierGuild: unit._id },
      });
    }

    res.status(201).json(unit);
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ error: "Error creating unit" });
  }
});

// Transfer unit to new holder
router.patch(
  "/:id/transfer",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { newHolderId, newHolderModel } = req.body;

      const unit = await Unit.findById(req.params.id).populate("holder");
      if (!unit) {
        res.status(404).json({ error: "Unit not found" });
        return;
      }

      // Verify ownership of both current and new holders
      let currentHolder, newHolder;
      if (unit.holder instanceof Hero) {
        currentHolder = await Hero.findOne({
          _id: unit.holder,
          player: req.user!.id,
        });
      } else {
        currentHolder = await Castle.findOne({
          _id: unit.holder,
          owner: req.user!.id,
        });
      }

      if (newHolderModel === "Hero") {
        newHolder = await Hero.findOne({
          _id: newHolderId,
          player: req.user!.id,
        });
      } else {
        newHolder = await Castle.findOne({
          _id: newHolderId,
          owner: req.user!.id,
        });
      }

      if (!currentHolder || !newHolder) {
        res.status(403).json({ error: "Not authorized to transfer unit" });
        return;
      }

      // Update unit's holder
      unit.holder = newHolderId;
      unit.holderModel = newHolderModel;
      await unit.save();

      // Update holders' unit arrays
      if (unit.holder instanceof Hero) {
        await Hero.findByIdAndUpdate(unit.holder, {
          $pull: { units: unit._id },
        });
      } else {
        await Castle.findByIdAndUpdate(unit.holder, {
          $pull: { soldierGuild: unit._id },
        });
      }

      if (newHolderModel === "Hero") {
        await Hero.findByIdAndUpdate(newHolderId, {
          $push: { units: unit._id },
        });
      } else {
        await Castle.findByIdAndUpdate(newHolderId, {
          $push: { soldierGuild: unit._id },
        });
      }

      res.json(unit);
    } catch (error) {
      console.error("Error transferring unit:", error);
      res.status(500).json({ error: "Error transferring unit" });
    }
  }
);

// Reorder units within a hero
router.patch(
  "/reorder",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { heroId, unitIds } = req.body;

      // Verify hero exists and belongs to user
      const hero = await Hero.findOne({
        _id: new ObjectId(heroId),
        player: new ObjectId(req.user!.userId),
      });

      if (!hero) {
        res.status(404).json({ error: "Hero not found" });
        return;
      }

      // Verify all units belong to the hero
      const units = await Unit.find({
        holder: hero._id,
      });
      if (units.length !== unitIds.length) {
        res.status(400).json({ error: "Invalid unit IDs" });
        return;
      }
      for (let i = 0; i < unitIds.length; i++) {
        const unit = units.find((unit) => unit._id.equals(unitIds[i]));
        if (unit) {
          unit.order = i;
          await unit.save();
        }
      }
      // Update the order of units in the hero's units array
      // The order of unitIds in the request determines the new order
      hero.units = units.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      await hero.save();

      res.json(hero);
    } catch (error) {
      console.error("Error reordering units:", error);
      res.status(500).json({ error: "Error reordering units" });
    }
  }
);

export default router;
