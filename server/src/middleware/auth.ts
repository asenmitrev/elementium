import { Request, Response, NextFunction } from "express";
import { TokenService } from "../auth/token.service";

const tokenService = new TokenService();

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const user = tokenService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};
