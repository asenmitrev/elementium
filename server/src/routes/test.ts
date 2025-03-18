import express, { Request, Response, Router } from "express";
import { Unit } from "../models/unit.model";
import { authenticateToken } from "../middleware/auth";
import { Hero } from "../models/hero.model";
import { Castle } from "../models/castle.model";

const router: Router = express.Router();

router.get(
    "/test",
    authenticateToken,
    async (req: Request, res: Response) => {
      console.log('test')
      res.status(200).json({message: 'test'})
    }
  );