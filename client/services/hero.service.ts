import axios from "axios";
import { Hero } from "types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export class HeroService {
  static async getHero(heroId: string, cookie?: string): Promise<Hero> {
    const response = await axios.get(
      `${API_URL}/heroes/${heroId}`,
      cookie
        ? {
            headers: {
              Cookie: cookie || "",
            },
          }
        : {
            withCredentials: true,
          }
    );
    return response.data;
  }

  static async getHeroes(cookie?: string): Promise<Hero[]> {
    const response = await axios.get(
      `${API_URL}/heroes`,
      cookie
        ? {
            headers: {
              Cookie: cookie || "",
            },
          }
        : {
            withCredentials: true,
          }
    );
    return response.data;
  }

  static async getPredefinedHeroes(cookie?: string): Promise<Hero[]> {
    const response = await axios.get(
      `${API_URL}/heroes/predefined-units`,
      cookie
        ? {
            headers: {
              Cookie: cookie || "",
            },
          }
        : {
            withCredentials: true,
          }
    );
    return response.data;
  }

  static async createHero(heroData: Partial<Hero>): Promise<Hero> {
    const response = await axios.post(`${API_URL}/heroes`, heroData, {
      withCredentials: true,
    });
    return response.data;
  }

  static async createPredefinedHero(heroId: string): Promise<Hero> {
    const response = await axios.post(
      `${API_URL}/heroes/predefined-units`,
      {
        heroId,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async updateHero(
    heroId: string,
    heroData: Partial<Hero>
  ): Promise<Hero> {
    const response = await axios.patch(
      `${API_URL}/heroes/${heroId}`,
      heroData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async deleteHero(heroId: string): Promise<void> {
    await axios.delete(`${API_URL}/heroes/${heroId}`, {
      withCredentials: true,
    });
  }
}
