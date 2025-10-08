"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import API from "@/lib/axios";
import { AxiosError } from "axios";

export type Mood = "sad" | "angry" | "anxious" | "happy" | "neutral";
export type Visibility = "public" | "private";

export interface Vent {
   _id: string;
   message: string;
   mood: Mood;
   visibility: Visibility;
   userId: string;
   createdAt: string;
   updatedAt: string;
}

interface VentFormValues {
   message: string;
   mood: Mood;
   visibility: Visibility;
}

interface VentFormProps {
   ventId?: string;
   defaultValues?: Partial<VentFormValues>;
   onSuccess: (newVent?: Vent) => void;
   onCancel: () => void;
}

const allowedMoods: Mood[] = ["sad", "angry", "anxious", "happy", "neutral"];

export default function VentForm({
   ventId,
   defaultValues,
   onSuccess,
   onCancel,
}: VentFormProps) {
   const [loading, setLoading] = useState(false);
   const messageRef = useRef<HTMLTextAreaElement>(null);

   const form = useForm<VentFormValues>({
      defaultValues: {
         message: defaultValues?.message ?? "",
         mood: defaultValues?.mood ?? "neutral",
         visibility: defaultValues?.visibility ?? "public",
      },
   });

   useEffect(() => {
      messageRef.current?.focus();
   }, []);

   const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

   const onSubmit: SubmitHandler<VentFormValues> = async (values) => {
      setLoading(true);
      try {
         const res = ventId
            ? await API.patch<{ message: Vent }>(
                 `/vents/update/${ventId}`,
                 values
              )
            : await API.post<{ message: Vent }>("/vents/create", values);

         toast.success(
            ventId ? "Vent updated successfully!" : "Vent created successfully!"
         );

         onSuccess(res.data.message);
         form.reset(values);
      } catch (err: unknown) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else if (err instanceof AxiosError && err.response?.data?.message) {
            toast.error(err.response.data.message);
         } else {
            toast.error("Failed to submit vent");
         }
      } finally {
         setLoading(false);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.3 }}
         className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-lg"
      >
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* Message */}
               <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                           <Textarea
                              {...field}
                              ref={messageRef}
                              placeholder="Write your vent..."
                              rows={4}
                              className="resize-none"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Mood */}
               <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Mood</FormLabel>
                        <FormControl>
                           <select
                              {...field}
                              aria-label="Select your mood"
                              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                           >
                              {allowedMoods.map((m) => (
                                 <option key={m} value={m}>
                                    {capitalize(m)}
                                 </option>
                              ))}
                           </select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Visibility */}
               <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <FormControl>
                           <select
                              {...field}
                              aria-label="Select visibility"
                              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                           >
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                           </select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Buttons */}
               <div className="flex justify-end gap-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancel}
                     disabled={loading}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                     {loading ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                           Please wait...
                        </>
                     ) : ventId ? (
                        "Update Vent"
                     ) : (
                        "Add Vent"
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </motion.div>
   );
}
