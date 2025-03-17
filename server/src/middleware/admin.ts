import { Request, Response, NextFunction } from "express";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking admin status", error });
  }
};
