import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type {
  User,
  Session,
  AuthOptions,
  UserObject,
  AuthValidity,
} from "next-auth";
import type { JWT } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
async function refreshAccessToken(nextAuthJWTCookie: JWT): Promise<JWT> {
  try {
    // Get a new access token from backend using the refresh token
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refreshToken: nextAuthJWTCookie.data.tokens.refresh,
      }),
    });
    const accessToken: {
      accessToken: {
        token: string;
        expiresIn: number;
      };
      refreshToken: {
        token: string;
        expiresIn: number;
      };
    } = await res.json();

    if (!res.ok) throw accessToken;

    // Update the token and validity in the next-auth cookie
    nextAuthJWTCookie.data.validity.valid_until =
      new Date().getTime() + accessToken.accessToken.expiresIn;
    nextAuthJWTCookie.data.tokens.access = accessToken.accessToken.token;

    // Clone the object to ensure it has a new ref id
    return { ...nextAuthJWTCookie };
  } catch (error) {
    console.debug(error);
    return {
      ...nextAuthJWTCookie,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "john",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username || "",
              password: credentials?.password || "",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const tokens: {
            onboardingStep: number;
            accessToken: {
              token: string;
              expiresIn: number;
            };
            refreshToken: {
              token: string;
              expiresIn: number;
            };
          } = await res.json();
          if (!res.ok) throw tokens;

          // Extract the user from the access token
          const user: UserObject = {
            onboardingStep: tokens.onboardingStep,
            accessToken: tokens.accessToken.token,
            refreshToken: tokens.refreshToken.token,
          };
          // Extract the auth validity from the tokens
          const validity: AuthValidity = {
            valid_until: new Date().getTime() + tokens.accessToken.expiresIn,
            refresh_until: new Date().getTime() + tokens.refreshToken.expiresIn,
          };
          // Return the object that next-auth calls 'User'
          // (which we've defined in next-auth.d.ts)
          return {
            // User object needs to have a string id so use refresh token id
            id: tokens.refreshToken.token,
            tokens: {
              access: tokens.accessToken.token,
              refresh: tokens.refreshToken.token,
            },
            user: user,
            validity: validity,
          } as User;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user: User;
      account: any;
    }) {
      // Initial signin contains a 'User' object from authorize method
      if (user && account) {
        console.debug("Initial signin");
        return { ...token, data: user };
      }

      // The current access token is still valid
      if (Date.now() < token.data.validity.valid_until * 1000) {
        console.debug("Access token is still valid");
        return token;
      }

      // The refresh token is still valid
      if (Date.now() < token.data.validity.refresh_until * 1000) {
        console.debug("Access token is being refreshed");
        return await refreshAccessToken(token);
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      console.debug("Both tokens have expired");
      return { ...token, error: "RefreshTokenExpired" } as JWT;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      session.user = token.data.user;
      session.validity = token.data.validity;
      session.error = token.error;
      return session;
    },
  },
};

export default NextAuth(authOptions);
