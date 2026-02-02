"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/lib/auth/api";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto my-auto h-full">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Please fill in your details below</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={isLoading}
                className="pl-8"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                autoComplete="password"
                required
                disabled={isLoading}
                className="pl-8"
              />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">
                {isLoading ? (
                  <>
                    <Spinner />
                    Sign in
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
