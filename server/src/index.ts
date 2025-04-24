import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// ... other imports ...

import cors from "cors";
import authRoutes from "./routes/auth";
import dotenv from "dotenv";
import castleRoutes from "./routes/castle";
import heroRoutes from "./routes/hero";
import unitRoutes from "./routes/unit";
import heroTypeRoutes from "./routes/heroType.routes";
import battleRoutes from "./routes/battle";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("📦 Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://elementium-theta.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/castles", castleRoutes);
app.use("/heroes", heroRoutes);
app.use("/heroTypes", heroTypeRoutes);
app.use("/units", unitRoutes);
app.use("/battle", battleRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript!" });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Error handling for MongoDB connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
