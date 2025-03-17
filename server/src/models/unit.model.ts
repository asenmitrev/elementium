import mongoose, { Schema, Document } from "mongoose";
import { Unit as IUnit } from "../../../types";

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

const UnitSchema = new Schema(
  {
    type: UnitTypeSchema,
    holder: {
      // Can be either a Castle or Hero
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "holderModel",
    },
    holderModel: {
      type: String,
      required: true,
      enum: ["Castle", "Hero"],
    },
    experienceTillLevelUp: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
UnitSchema.index({ holder: 1 });

export const Unit = mongoose.model<
  IUnit & { holderModel: "Hero" | "Castle" } & Document
>("Unit", UnitSchema);
