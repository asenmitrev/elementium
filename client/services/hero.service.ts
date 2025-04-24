import axios from "axios";
import { Hero, HeroType, Unit, UnitType } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export class HeroService {
  static async getHero(
    heroId: string,
    cookie: string
  ): Promise<Hero & { units: Unit[] }> {
    const response = await axios.get(`${API_URL}/heroes/${heroId}`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    return response.data;
  }

  static async getHeroes(
    cookie: string
  ): Promise<(Hero & { units: Unit[] })[]> {
    const response = await axios.get<(Hero & { units: Unit[] })[]>(
      `${API_URL}/heroes`,
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      }
    );
    return response.data;
  }

  static async getAllMapHeroes(
    cookie: string
  ): Promise<(Hero & { units: Unit[] })[]> {
    const response = await axios.get<(Hero & { units: Unit[] })[]>(
      `${API_URL}/heroes/map`,
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      }
    );
    return response.data;
  }

  static async getPredefinedHeroes(
    cookie: string
  ): Promise<(HeroType & { units: UnitType[] })[]> {
    const response = await axios.get(`${API_URL}/heroes/predefined-units`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    return response.data;
  }

  static async getPredefinedNeutrals(
    cookie: string
  ): Promise<HeroType & { units: UnitType[] }> {
    const response = await axios.get(`${API_URL}/heroes/onboarding-neutrals`, {
      headers: { Authorization: `Bearer ${cookie}` },
    });
    return response.data;
  }

  static async createHero(
    heroData: Partial<Hero>,
    cookie: string
  ): Promise<Hero> {
    const response = await axios.post(`${API_URL}/heroes`, heroData, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
    return response.data;
  }

  static async createPredefinedHero(
    heroName: string,
    cookie: string
  ): Promise<Hero> {
    const response = await axios.post(
      `${API_URL}/heroes/predefined-units`,
      {
        heroName,
      },
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      }
    );
    return response.data;
  }

  static async updateHero(
    heroId: string,
    heroData: Partial<Hero>,
    cookie: string
  ): Promise<Hero> {
    const response = await axios.patch(
      `${API_URL}/heroes/${heroId}`,
      heroData,
      {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      }
    );
    return response.data;
  }

  static async deleteHero(heroId: string, cookie: string): Promise<void> {
    await axios.delete(`${API_URL}/heroes/${heroId}`, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });
  }
}
