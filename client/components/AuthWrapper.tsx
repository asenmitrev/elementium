import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

// Define which routes are public/protected
const publicRoutes = ["/login", "/register", "/"]; // Add all your public routes

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { status } = useSession();
  const router = useRouter();

  // Don't show anything while loading
  if (status === "loading") {
    return null; // or a loading spinner
  }

  // If on a protected route and not authenticated, redirect to login
  if (!publicRoutes.includes(router.pathname) && status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // If on login page and already authenticated, redirect to home
  if (publicRoutes.includes(router.pathname) && status === "authenticated") {
    router.push("/castles");
    return null;
  }

  return <>{children}</>;
}
