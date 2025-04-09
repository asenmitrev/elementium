import axios from "axios";
import { Castle, Hero, Unit } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export class CastleService {
  static async getCastle(castleId: string, cookie?: string): Promise<Castle> {
    const response = await axios.get(
      `${API_URL}/castles/${castleId}`,
      cookie
        ? {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
          }
        : {
            withCredentials: true,
          }
    );
    return response.data;
  }

  static async getCastles(cookie?: string): Promise<Castle[]> {
    const response = await axios.get(
      `${API_URL}/castles`,
      cookie
        ? {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
          }
        : {
            withCredentials: true,
          }
    );
    return response.data;
  }

  static async createCapitalCastle(
    type: "fire" | "water" | "earth",
    cookie: string
  ): Promise<Castle> {
    const response = await axios.post(
      `${API_URL}/castles`,
      {
        type,
        isCapital: true,
      },
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      }
    );
    return response.data;
  }

  static async getCastleHeroes(
    castleId: string,
    cookie: string
  ): Promise<(Hero & { units: Unit[] })[]> {
    const response = await fetch(`${API_URL}/castles/${castleId}/heroes`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    return response.json();
  }
}
