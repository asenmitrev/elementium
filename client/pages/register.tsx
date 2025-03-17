"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AuthService, AuthError } from "@/services/auth.service";
import Link from "next/link";
import { toast } from "sonner";

type FormData = {
  username: string;
  email: string;
  password: string;
};
export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<FormData>();
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await AuthService.register(data.username, data.email, data.password);
      toast.success("Registration successful! Please sign in.");
      router.push("/login?registered=true");
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={formMethods.handleSubmit(handleSubmit)}
      className="space-y-6 w-full max-w-md mx-auto pt-10"
      noValidate
    >
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          required
          {...formMethods.register("username", {
            required: "Username is required",
          })}
        />
        {formMethods.formState.errors.username && (
          <p className="text-sm text-red-500">
            {formMethods.formState.errors.username.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          {...formMethods.register("email", {
            required: "Email is required",
          })}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Your email will only be used for account recovery purposes.
        </p>
        {formMethods.formState.errors.email && (
          <p className="text-sm text-red-500">
            {formMethods.formState.errors.email.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          {...formMethods.register("password", {
            required: "Password is required",
          })}
        />
        {formMethods.formState.errors.password && (
          <p className="text-sm text-red-500">
            {formMethods.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>

      <div className="text-center mt-4">
        <Link
          href="/login"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}
