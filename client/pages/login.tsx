"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "sonner";
import type { GetServerSideProps, GetServerSidePropsResult } from "next";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
type SignInFormValues = {
  username: string;
  password: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/castles", permanent: false } };
  }
  return { props: {} } as GetServerSidePropsResult<{}>;
};
export default function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      toast.success("Successfully signed in!");
      router.push("/castles");
    } catch (error) {
      const authError = error as Error;
      toast.error(authError.message || "Failed to sign in");
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
