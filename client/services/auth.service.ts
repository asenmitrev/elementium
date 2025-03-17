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
  static async login(
    username: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username, // Currently the backend expects email
        password,
      });
      return response.data;
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
      await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
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
}
