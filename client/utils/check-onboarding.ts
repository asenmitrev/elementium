import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function checkAuthServer(context: GetServerSidePropsContext) {
  try {
    const session = await getServerSession(
      context.req as any,
      context.res as any,
      authOptions
    );
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    });

    return {
      props: {
        isAuthenticated: response.ok,
        onboardingStep: (await response.json()).onboardingStep,
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
  if (
    authCheck.props.isAuthenticated &&
    authCheck.props.onboardingStep === 0 &&
    !context.resolvedUrl.includes("/choose-element")
  ) {
    return {
      redirect: {
        destination: "/choose-element",
        permanent: false,
      },
    };
  } else if (
    authCheck.props.isAuthenticated &&
    authCheck.props.onboardingStep === 1 &&
    !context.resolvedUrl.includes("/choose-hero")
  ) {
    return {
      redirect: {
        destination: "/choose-hero",
        permanent: false,
      },
    };
  } else if (
    authCheck.props.isAuthenticated &&
    authCheck.props.onboardingStep === 2 &&
    !context.resolvedUrl.includes("/neutral-battle")
  ) {
    return {
      redirect: {
        destination: "/neutral-battle",
        permanent: false,
      },
    };
  }

  return authCheck;
}
