import { useRouter } from "next/router";
import { ReactNode } from "react";

// Define which routes are public/protected

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  console.log("Asen e gei")
  return <>{children}</>;
}
