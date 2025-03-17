import axios from "axios";
import { Castle } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export class CastleService {
  static async getCastle(castleId: string): Promise<Castle> {
    const response = await axios.get(`${API_URL}/castle/${castleId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  }

  static async getCastles(): Promise<Castle[]> {
    const response = await axios.get(`${API_URL}/castle`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  }
}
