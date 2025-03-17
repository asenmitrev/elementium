import mongoose, { Schema, Document } from "mongoose";
import { Hero as IHero } from "../../../types";

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

const MissionSchema = new Schema({
  destinationX: Number,
  destinationY: Number,
  travelTime: Date,
});

const HeroSchema = new Schema(
  {
    type: HeroTypeSchema,
    x: {
      type: Number,
      default: null,
    },
    y: {
      type: Number,
      default: null,
    },
    units: [
      {
        type: Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experienceTillLevelUp: {
      type: Number,
      default: 100,
    },
    mission: {
      type: MissionSchema,
      default: null,
    },
    alive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
HeroSchema.index({ player: 1 });
HeroSchema.index({ x: 1, y: 1 });

export const Hero = mongoose.model<IHero & Document>("Hero", HeroSchema);
