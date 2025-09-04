"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ReflectionFormProps {
   reflectionId?: string;
   defaultValues?: {
      title?: string;
      content: string;
      emotion?: string;
      tags?: string;
   };
   onSuccess: (newReflection?: any) => void;
   onCancel: () => void;
}

const allowedEmotions = [
   "happy",
   "sad",
   "angry",
   "neutral",
   "excited",
] as const;

export default function ReflectionForm({
   reflectionId,
   defaultValues,
   onSuccess,
   onCancel,
}: ReflectionFormProps) {
   const [loading, setLoading] = useState(false);

   const form = useForm({
      defaultValues: {
         title: defaultValues?.title || "",
         content: defaultValues?.content || "",
         emotion: defaultValues?.emotion || "",
         tags: defaultValues?.tags || "",
      },
   });

   const onSubmit = async (values: any) => {
      setLoading(true);
      try {
         const userId = localStorage.getItem("userId");
         if (!userId) throw new Error("User not authenticated");

         const payload = {
            ...values,
            userId,
            tags: values.tags
               ? values.tags
                    .split(",")
                    .map((tag: string) => tag.trim())
                    .filter(Boolean)
               : [],
         };

         let res;
         if (reflectionId) {
            res = await API.patch(
               `/reflections/update/${reflectionId}`,
               payload
            );
            toast.success("Reflection updated");
         } else {
            res = await API.post("/reflections/create", payload);
            toast.success("Reflection created");
         }

         onSuccess(res.data.message);
      } catch (err: any) {
         toast.error(
            err.response?.data?.message || "Failed to submit reflection"
         );
      } finally {
         setLoading(false);
      }
   };

   const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

   return (
      <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         transition={{ duration: 0.25 }}
         className="bg-white dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg w-full max-w-3xl mx-auto"
      >
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Title */}
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Title
                        </FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Reflection title"
                              {...field}
                              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Content */}
               <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Content
                        </FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Write your reflection..."
                              {...field}
                              rows={5}
                              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Emotion */}
               <FormField
                  control={form.control}
                  name="emotion"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Emotion
                        </FormLabel>
                        <FormControl>
                           <select
                              {...field}
                              className="w-full border rounded-md px-3 py-2
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-primary"
                           >
                              <option value="">Select emotion</option>
                              {allowedEmotions.map((e) => (
                                 <option key={e} value={e}>
                                    {capitalize(e)}
                                 </option>
                              ))}
                           </select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Tags */}
               <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Tags (comma separated)
                        </FormLabel>
                        <FormControl>
                           <Input
                              placeholder="e.g., productivity, mood"
                              {...field}
                              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Buttons */}
               <div className="flex justify-end space-x-3">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancel}
                     disabled={loading}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     disabled={loading}
                     className="flex items-center gap-2"
                  >
                     {loading ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" /> Please
                           wait...
                        </>
                     ) : reflectionId ? (
                        "Update Reflection"
                     ) : (
                        "Add Reflection"
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </motion.div>
   );
}
