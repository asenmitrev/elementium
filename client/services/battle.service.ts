import axios from "axios";
import { TerrainType } from "@/components/map";

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

  static async startBattle(
    attackerHeroId: string,
    defenderHeroId: string,
    cookie: string,
    terrain?: TerrainType
  ): Promise<any> {
    // Convert TerrainType enum to the server's Land string
    let landType = null;
    if (terrain) {
      landType = terrain; // TerrainType enum values match the server's expected values
    }

    const response = await axios.post(
      `${API_URL}/battle`,
      {
        attackerHeroId,
        defenderHeroId,
        terrain: landType,
      },
      {
        headers: { Authorization: `Bearer ${cookie}` },
      }
    );
    return response.data;
  }

  static async startMapBattle(
    defenderHeroId: string,
    cookie: string,
    terrain?: TerrainType
  ): Promise<{ battleOccurred: boolean; battle?: any }> {
    const response = await axios.post(
      `${API_URL}/battle/map-battle`,
      {
        defenderHeroId,
        terrain,
      },
      {
        headers: { Authorization: `Bearer ${cookie}` },
      }
    );
    return response.data;
  }
}
