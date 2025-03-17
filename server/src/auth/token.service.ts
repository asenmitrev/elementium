import jwt from "jsonwebtoken";
import { User } from "types/user";

export class TokenService {
  private readonly secretKey: string;
  private readonly accessTokenExpiry: string = "15m";
  private readonly refreshTokenExpiry: string = "7d";

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    this.secretKey = process.env.JWT_SECRET;
  }

  generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      type: "access",
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.accessTokenExpiry,
      algorithm: "HS256",
    });
  }

  generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      type: "refresh",
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.refreshTokenExpiry,
      algorithm: "HS256",
    });
  }

  verifyToken(token: string): jwt.JwtPayload {
    try {
      return jwt.verify(token, this.secretKey) as jwt.JwtPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
