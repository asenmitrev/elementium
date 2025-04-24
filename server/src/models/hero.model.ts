import mongoose, { Schema, Document } from "mongoose";
import { HeroType, Hero as IHero } from "types";

// Create schema for the embedded HeroType
const HeroTypeSchema = new Schema<HeroType>({
  name: String,
  image: String,
  wind: Number,
  earth: Number,
  fire: Number,
  water: Number,
  leadership: Number,
  counterEspionage: Number,
  level: Number,
  howManyPeopleHaveIt: Number,
  race: {
    type: Schema.Types.Mixed,
    required: true,
  },
  evolutions: [Schema.Types.Mixed],
});

const MissionSchema = new Schema({
  destinationX: Number,
  destinationY: Number,
  travelTime: Date,
});

const HeroSchema = new Schema(
  {
    type: {
      type: HeroTypeSchema,
      required: true,
    },
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
HeroSchema.index({ player: 1, x: 1, y: 1 });
export const Hero = mongoose.model<IHero & Document>("Hero", HeroSchema);
