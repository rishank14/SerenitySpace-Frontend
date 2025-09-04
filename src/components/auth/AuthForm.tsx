"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
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
import { Loader2 } from "lucide-react";

type AuthType = "sign-in" | "sign-up";

interface AuthFormProps {
   type: AuthType;
}

export default function AuthForm({ type }: AuthFormProps) {
   const router = useRouter();
   const { user, loading: authLoading, login, signup } = useAuth();
   const [loading, setLoading] = useState(false);
   const [formError, setFormError] = useState("");

   const isSignUp = type === "sign-up";

   const form = useForm<SignUpInput | SignInInput>({
      resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
      defaultValues: isSignUp
         ? { email: "", username: "", password: "" }
         : { identifier: "", password: "" },
   });

   // Redirect logged-in users away from auth pages
   useEffect(() => {
      if (!authLoading && user) {
         router.replace("/dashboard");
      }
   }, [authLoading, user, router]);

   const onSubmit = async (values: SignUpInput | SignInInput) => {
      setLoading(true);
      setFormError("");

      try {
         if (isSignUp) {
            const { email, username, password } = values as SignUpInput;
            await signup(username, email, password);
         } else {
            const { identifier, password } = values as SignInInput;
            await login(identifier, password);
         }

         router.replace("/dashboard");
      } catch (err: any) {
         // Display backend message in form
         setFormError(err.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   if (authLoading || user) {
      return (
         <div className="w-full max-w-md mx-auto py-12 px-4 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
         </div>
      );
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-md mx-auto py-12 px-4"
      >
         <h1 className="text-3xl font-bold text-center mb-1">
            {isSignUp ? "Create an Account" : "Welcome Back"}
         </h1>
         <p className="text-center text-muted-foreground mb-6">
            {isSignUp
               ? "Join SerenitySpace and start your mindful journey ✨"
               : "Welcome back to SerenitySpace 🌿"}
         </p>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="bg-white dark:bg-gray-950 border border-border rounded-xl shadow-md p-6 space-y-6"
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

               {formError && (
                  <p className="text-red-500 text-sm text-center">
                     {formError}
                  </p>
               )}

               <Button type="submit" className="w-full" disabled={loading}>
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
      </motion.div>
   );
}
