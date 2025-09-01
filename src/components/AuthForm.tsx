"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import API  from "@/lib/axios"; // axios instance with baseURL hidden
import {
   signUpSchema,
   signInSchema,
   SignUpInput,
   SignInInput,
} from "@/lib/validations/auth.schema";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthType = "sign-in" | "sign-up";

interface AuthFormProps {
   type: AuthType;
}

export default function AuthForm({ type }: AuthFormProps) {
   const router = useRouter();
   const { login } = useAuth();
   const [loading, setLoading] = useState(false);

   const isSignUp = type === "sign-up";

   const form = useForm<SignUpInput | SignInInput>({
      resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
      defaultValues: isSignUp
         ? { email: "", username: "", password: "" }
         : { identifier: "", password: "" },
   });

   const onSubmit = async (values: SignUpInput | SignInInput) => {
      setLoading(true);

      try {
         if (isSignUp) {
            const { email, username, password } = values as SignUpInput;

            // API call for registration (axios instance has baseURL)
            const res = await API.post("/users/register", {
               email,
               username,
               password,
            });
            if (!res.data) throw new Error("Registration failed");

            // Auto-login after signup
            await login(email, password);
            toast.success("Account created successfully!");
         } else {
            const { identifier, password } = values as SignInInput;
            await login(identifier, password);
            toast.success("Logged in successfully!");
         }

         router.push("/dashboard");
      } catch (err: any) {
         toast.error(
            err.response?.data?.message || err.message || "Something went wrong"
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-full max-w-md mx-auto py-12 px-4">
         <h1 className="text-3xl font-bold text-center mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
         </h1>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-xl space-y-6"
            >
               {isSignUp && (
                  <>
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...field}
                                 />
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
               )}

               {!isSignUp && (
                  <FormField
                     control={form.control}
                     name="identifier"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email or Username</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="you@example.com or johndoe"
                                 {...field}
                              />
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
                           <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button
                  type="submit"
                  className={cn("w-full")}
                  disabled={loading}
               >
                  {loading ? (
                     <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Please wait...
                     </>
                  ) : isSignUp ? (
                     "Sign Up"
                  ) : (
                     "Sign In"
                  )}
               </Button>
            </form>
         </Form>

         <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? (
               <>
                  Already have an account?{" "}
                  <Link
                     href="/sign-in"
                     className="text-primary hover:underline"
                  >
                     Sign In
                  </Link>
               </>
            ) : (
               <>
                  Don’t have an account?{" "}
                  <Link
                     href="/sign-up"
                     className="text-primary hover:underline"
                  >
                     Sign Up
                  </Link>
               </>
            )}
         </p>
      </div>
   );
}
