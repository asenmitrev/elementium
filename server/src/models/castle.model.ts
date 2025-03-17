import mongoose, { Schema, Document } from "mongoose";
import { Castle as ICastle } from "types";

const castleImagePaths = {
  water: [
    "/images/castle-water-2.jpg",
    "/images/castle-water-3.jpg",
    "/images/castle-water.jpg",
  ],
  earth: ["/images/castle-earth.jpg"],
  fire: ["/images/castle-fire.jpg"],
};

const BuildingSchema = new Schema({
  level: Number,
  type: String,
  cost: Number,
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
    heroesStationed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],
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
    heroGuild: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],
    soldierGuild: [
      {
        type: Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
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

// Add pre-validate middleware to set random image only for new documents
CastleSchema.pre("validate", function (next) {
  if (this.isNew && !this.image) {
    const type = this.type;
    const images = castleImagePaths[type];
    const randomIndex = Math.floor(Math.random() * images.length);
    this.image = images[randomIndex];
  }
  next();
});

// Create indexes for faster queries
CastleSchema.index({ x: 1, y: 1 }, { unique: true });
CastleSchema.index({ owner: 1 });

export const Castle = mongoose.model<ICastle & Document>(
  "Castle",
  CastleSchema
);
