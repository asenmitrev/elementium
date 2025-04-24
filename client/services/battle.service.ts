import axios from "axios";
import { HeroType, UnitType } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export class BattleService {
  static async startNeutralBattle(cookie: string): Promise<any> {
    const response = await axios.post(
      `${API_URL}/battle/onboarding-neutral`,
      {},
      {
        headers: { Authorization: `Bearer ${cookie}` },
      }
    );
    return response.data;
  }

  static async getBattle(battleId: string, cookie: string): Promise<any> {
    const response = await axios.get(`${API_URL}/battle/${battleId}`, {
      headers: { Authorization: `Bearer ${cookie}` },
    });
    return response.data;
  }
}
