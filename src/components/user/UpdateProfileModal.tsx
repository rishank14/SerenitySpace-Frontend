"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import API from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const updateProfileSchema = z.object({
   username: z.string().min(3, "Username must be at least 3 characters"),
   email: z.string().email("Invalid email"),
});

type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

interface UpdateProfileModalProps {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateProfileModal({
   open,
   setOpen,
}: UpdateProfileModalProps) {
   const { user, refreshUser } = useAuth();
   const [loading, setLoading] = useState(false);
   const initialFocusRef = useRef<HTMLInputElement>(null);

   const form = useForm<UpdateProfileInput>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         username: "",
         email: "",
      },
   });

   // Populate form with fresh user values when modal opens
   useEffect(() => {
      if (open && user) {
         form.reset({
            username: user.username || "",
            email: user.email || "",
         });

         // Auto-focus username input
         setTimeout(() => {
            initialFocusRef.current?.focus();
         }, 100);
      }
   }, [open, user, form]);

   const onSubmit = async (values: UpdateProfileInput) => {
      setLoading(true);
      try {
         const res = await API.patch("/users/update-profile", values);
         toast.success(res.data.data || "Profile updated");
         await refreshUser();
         setOpen(false);
      } catch (err: unknown) {
         if (err instanceof Error) {
            // Handles generic Error
            toast.error(err.message);
         } else if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            (err as any).response?.data?.message
         ) {
            // Handles AxiosError shape
            toast.error((err as any).response.data.message);
         } else {
            toast.error("Update failed");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="text-xl">Update Profile</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-2"
                  noValidate
               >
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Username</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 ref={initialFocusRef}
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
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 type="email"
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
                        disabled={loading || !form.formState.isDirty} // disable if loading or no changes
                        className="w-full"
                     >
                        {loading ? "Updating..." : "Update"}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
