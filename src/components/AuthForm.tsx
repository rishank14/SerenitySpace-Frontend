"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { signUpSchema, signInSchema } from "@/lib/validations/auth.schema";
import { z } from "zod";
import { useState } from "react";

type AuthType = "sign-in" | "sign-up";

interface AuthFormProps {
  type: AuthType;
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const schema = type === "sign-up" ? signUpSchema : signInSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      type === "sign-up"
        ? { email: "", username: "", password: "" }
        : { identifier: "", password: "" },
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const endpoint =
        type === "sign-up"
          ? `${baseURL}/users/register`
          : `${baseURL}/users/login`;

      const payload =
        type === "sign-up"
          ? values
          : {
              email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.identifier)
                ? values.identifier
                : undefined,
              username: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.identifier)
                ? values.identifier
                : undefined,
              password: values.password,
            };

      const res = await axios.post(endpoint, payload, { withCredentials: true });

      // Store userId, username, and accessToken
      const user = res.data.message?.user;
      const accessToken = res.data.message?.accessToken;

      if (user?._id) localStorage.setItem("userId", user._id);
      if (user?.username) localStorage.setItem("username", user.username);
      if (accessToken) localStorage.setItem("token", accessToken);

      toast.success(res.data.data || "Success");
      router.push("/");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        {type === "sign-up" ? "Create an Account" : "Welcome Back"}
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-xl space-y-6"
        >
          {type === "sign-up" ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com or johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={cn("w-full")} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait...
              </>
            ) : type === "sign-up" ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {type === "sign-up" ? (
          <>
            Already have an account?{" "}
            <a href="/sign-in" className="text-primary hover:underline">
              Sign In
            </a>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <a href="/sign-up" className="text-primary hover:underline">
              Sign Up
            </a>
          </>
        )}
      </p>
    </div>
  );
}
