"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import API from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";

const changePasswordSchema = z.object({
   currentPassword: z.string().min(6, "Enter current password"),
   newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangePasswordModal({
   open,
   setOpen,
}: ChangePasswordModalProps) {
   const [loading, setLoading] = useState(false);
   const passwordRef = useRef<HTMLInputElement>(null);

   const form = useForm<ChangePasswordInput>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
         currentPassword: "",
         newPassword: "",
      },
   });

   useEffect(() => {
      if (open) {
         form.reset(); // Reset fields
         setTimeout(() => {
            passwordRef.current?.focus();
         }, 100);
      }
   }, [open, form]);

   const onSubmit = async (values: ChangePasswordInput) => {
      setLoading(true);
      try {
         const res = await API.post<{ data: string }>(
            "/users/change-password",
            values
         );
         toast.success(res.data.data || "Password changed successfully");
         setOpen(false);
      } catch (err: unknown) {
         // Axios type guard
         const axiosErr = err as AxiosError<{ message?: string }>;
         if (axiosErr?.isAxiosError) {
            toast.error(axiosErr.response?.data?.message || axiosErr.message);
         } else if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Password change failed");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="text-xl">Change Password</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-2"
                  noValidate
               >
                  <FormField
                     control={form.control}
                     name="currentPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Current Password</FormLabel>
                           <FormControl>
                              <PasswordInput
                                 {...field}
                                 ref={passwordRef}
                                 autoFocus
                                 className="dark:bg-muted"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="newPassword"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>New Password</FormLabel>
                           <FormControl>
                              <PasswordInput
                                 {...field}
                                 className="dark:bg-muted"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <DialogFooter>
                     <Button
                        type="submit"
                        disabled={loading || !form.formState.isDirty}
                        className="w-full"
                     >
                        {loading ? "Changing..." : "Change Password"}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
