import mongoose, { Schema, Document } from "mongoose";
import { BattleResult as IBattleResult } from "types/battle/effectUtils";

// Define UnitTypeSimple Schema
const UnitTypeSimpleSchema = new Schema({
  effect: {
    type: Schema.Types.Mixed,
    default: null,
  },
  earth: Number,
  fire: Number,
  water: Number,
  name: String,
  specialExplanation: String,
  level: Number,
  image: String,
});

// Define EffectNarration Schema (used in RoundNarration)
const EffectNarrationSchema = new Schema({
  text: String,
  value: Number,
  stat: {
    type: String,
    enum: ["water", "fire", "earth", null],
    default: null,
  },
  effect: {
    type: String,
    enum: ["buff", "debuff"],
  },
});

// Define BattleEvaluation Schema (used in RoundNarration)
const BattleEvaluationSchema = new Schema({
  winner: {
    type: UnitTypeSimpleSchema,
    default: null,
  },
  loser: {
    type: UnitTypeSimpleSchema,
    default: null,
  },
  attacker: UnitTypeSimpleSchema,
  defender: UnitTypeSimpleSchema,
  text: String,
});

// Define RoundNarration Schema
const RoundNarrationSchema = new Schema({
  preAttacker: {
    type: EffectNarrationSchema,
    default: undefined,
  },
  preDefender: {
    type: EffectNarrationSchema,
    default: undefined,
  },
  battle: {
    type: BattleEvaluationSchema,
    default: undefined,
  },
  postAttacker: {
    type: EffectNarrationSchema,
    default: undefined,
  },
  postDefender: {
    type: EffectNarrationSchema,
    default: undefined,
  },
});

// Define BattleResult Schema
const BattleResultSchema = new Schema(
  {
    attacker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hero",
    },
    defender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hero",
    },
    playerAttacker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    playerDefender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    winner: {
      type: String,
      enum: ["attacker", "defender", "draw"],
    },
    remainingAttackerDeck: {
      type: [UnitTypeSimpleSchema],
      default: [],
    },
    remainingDefenderDeck: {
      type: [UnitTypeSimpleSchema],
      default: [],
    },
    HeroTypeUserFacingCastleNarrations: {
      type: [String],
      default: [],
    },
    rounds: {
      type: [RoundNarrationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
BattleResultSchema.index({ winner: 1 });
BattleResultSchema.index({ createdAt: -1 });

// Create and export the model
export const BattleResult = mongoose.model<
  IBattleResult & {
    attacker: string;
    defender: string;
    playerAttacker: string;
    playerDefender: string;
  } & Document
>("BattleResult", BattleResultSchema);
