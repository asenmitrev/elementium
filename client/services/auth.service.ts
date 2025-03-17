import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export class AuthService {
  static async login(username: string, password: string): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/auth/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.error || "An error occurred during login",
          status: error.response?.status,
        } as AuthError;
      }
      throw error;
    }
  }

  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/auth/register`,
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.error ||
            "An error occurred during registration",
          status: error.response?.status,
        } as AuthError;
      }
      throw error;
    }
  }

  static async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  }

  static async checkAuth(): Promise<boolean> {
    try {
      await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}
