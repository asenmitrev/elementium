"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import Link from "next/link";

type SignInFormValues = {
  username: string;
  password: string;
};

export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInResult, setSignInResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const router = useRouter();
  const formMethods = useForm<SignInFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsSubmitting(true);
    try {
      router.push("/castles");
    } catch (error) {
      setSignInResult({ success: false, message: "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6 w-full max-w-md mx-auto pt-10"
      >
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            required
            {...formMethods.register("username", {
              required: "Username or email is required",
            })}
          />
          {formMethods.formState.errors.username && (
            <p className="text-sm text-red-500">
              {formMethods.formState.errors.username.message}
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
          <Link href="/register">Don't have an account? Sign up</Link>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </FormProvider>
  );
}
