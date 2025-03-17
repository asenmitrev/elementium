import mongoose, { Schema, Document } from "mongoose";
import { Castle as ICastle } from "types";

const BuildingSchema = new Schema({
  name: String,
  level: Number,
  type: String,
  link: String,
  cost: Number,
  description: String,
});

const UnitTypeSchema = new Schema({
  effect: Schema.Types.Mixed,
  earth: Number,
  fire: Number,
  water: Number,
  name: String,
  specialExplanation: String,
  evolutions: [Schema.Types.Mixed],
  howManyPeopleHaveIt: Number,
  level: Number,
  image: String,
});

const HeroTypeSchema = new Schema({
  name: String,
  image: String,
  wind: Number,
  earth: Number,
  fire: Number,
  water: Number,
  slots: Number,
  evolutions: [Schema.Types.Mixed],
});

const HeroSchema = new Schema({
  _id: String,
  type: HeroTypeSchema,
  x: Number,
  y: Number,
  units: [UnitTypeSchema],
  level: Number,
  player: String,
  experienceTillLevelUp: Number,
  mission: {
    destinationX: Number,
    destinationY: Number,
    travelTime: Date,
  },
  alive: Boolean,
});

const CastleSchema = new Schema(
  {
    isCapital: {
      type: Boolean,
      required: true,
      default: false,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["fire", "water", "earth"],
      required: true,
    },
    image: String,
    heroesStationed: [HeroSchema],
    buildings: {
      walls: BuildingSchema,
      moat: BuildingSchema,
      magicShield: BuildingSchema,
      towers: BuildingSchema,
      mine: BuildingSchema,
      soldierGuild: BuildingSchema,
      heroGuild: BuildingSchema,
      spyGuild: BuildingSchema,
      counterEspionageGuild: BuildingSchema,
      altar: BuildingSchema,
    },
    heroGuild: [HeroSchema],
    soldierGuild: [UnitTypeSchema],
    buildingOrder: [
      {
        buildingOrdered: String,
        dateOfCompletion: Date,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
CastleSchema.index({ x: 1, y: 1 }, { unique: true });
CastleSchema.index({ owner: 1 });

export const Castle = mongoose.model<ICastle & Document>(
  "Castle",
  CastleSchema
);
