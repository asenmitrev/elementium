import { useRouter } from "next/router";
import { ReactNode } from "react";

// Define which routes are public/protected

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();

  return <>{children}</>;
}
