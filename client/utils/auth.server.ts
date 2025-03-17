import type { GetServerSidePropsContext } from "next";
import type { NextPageContext } from "next";
const API_URL = process.env.API_URL;
type ServerContext = GetServerSidePropsContext | NextPageContext;

export async function checkAuthServer(context: ServerContext) {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
      headers: {
        Cookie: context.req?.headers.cookie || "",
      },
    });

    return {
      props: {
        isAuthenticated: response.ok,
      },
    };
  } catch (error) {
    console.error("Error checking authentication:", error);
    return {
      props: {
        isAuthenticated: false,
      },
    };
  }
}

// Helper for protected pages
export async function requireAuth(context: GetServerSidePropsContext) {
  const authCheck = await checkAuthServer(context);

  if (!authCheck.props.isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return authCheck;
}
