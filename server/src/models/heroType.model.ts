import mongoose, { Schema, Document } from "mongoose";
import { HeroType as IHeroType } from "types";

const HeroTypeSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    wind: {
      type: Number,
      required: true,
    },
    earth: {
      type: Number,
      required: true,
    },
    fire: {
      type: Number,
      required: true,
    },
    water: {
      type: Number,
      required: true,
    },
    slots: {
      type: Number,
      required: true,
    },
    evolutions: [Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
);

export const HeroType = mongoose.model<IHeroType & Document>(
  "HeroType",
  HeroTypeSchema
);
