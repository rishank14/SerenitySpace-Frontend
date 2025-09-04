"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import API from "@/lib/axios";

// Get current IST + 1min in datetime-local format
const getISTPlus1Min = () => {
   const now = new Date();
   const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
   );
   ist.setMinutes(ist.getMinutes() + 1);
   const offset = ist.getTimezoneOffset();
   const localIST = new Date(ist.getTime() - offset * 60 * 1000);
   return localIST.toISOString().slice(0, 16);
};

// Convert UTC from backend → IST datetime-local
const convertUTCtoIST = (utcStr?: string) => {
   if (!utcStr) return getISTPlus1Min();
   const utcDate = new Date(utcStr);
   const istStr = utcDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
   });
   const [datePart, timePart] = istStr.split(", ");
   const [month, day, year] = datePart.split("/");
   const [hour, minute] = timePart.split(":");
   return `${year}-${month}-${day}T${hour}:${minute}`;
};

interface VaultFormProps {
   vaultId?: string;
   defaultValues?: { message: string; deliverAt: string };
   onSuccess: (vault?: any) => void;
   onCancel: () => void;
}

export default function VaultForm({
   vaultId,
   defaultValues,
   onSuccess,
   onCancel,
}: VaultFormProps) {
   const [loading, setLoading] = useState(false);
   const [timeWarning, setTimeWarning] = useState("");

   const minDeliverAt = useMemo(() => getISTPlus1Min(), []);

   const form = useForm({
      defaultValues: {
         message: defaultValues?.message || "",
         deliverAt: defaultValues?.deliverAt
            ? convertUTCtoIST(defaultValues.deliverAt)
            : minDeliverAt,
      },
   });

   const onDeliverAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      form.setValue("deliverAt", value);

      const selectedDate = new Date(value);
      const now = new Date();
      now.setSeconds(0, 0);
      now.setMinutes(now.getMinutes() + 1);

      setTimeWarning(
         selectedDate < now
            ? "⚠ Deliver time must be at least 1 minute in the future."
            : ""
      );
   };

   const onSubmit = async (values: any) => {
      if (!values.deliverAt) {
         toast.error("Please select a deliver time.");
         return;
      }

      const selectedDate = new Date(values.deliverAt);
      const now = new Date();
      now.setSeconds(0, 0);
      now.setMinutes(now.getMinutes() + 1);

      if (selectedDate < now) {
         toast.error("Deliver time must be at least 1 minute in the future.");
         return;
      }

      setLoading(true);
      try {
         const token = localStorage.getItem("token");
         if (!token) throw new Error("User not authenticated");

         const payload = {
            message: values.message,
            deliverAt: new Date(values.deliverAt).toISOString(),
         };

         const res = vaultId
            ? await API.patch(`/message-vault/update/${vaultId}`, payload, {
                 headers: { Authorization: `Bearer ${token}` },
              })
            : await API.post(`/message-vault/create`, payload, {
                 headers: { Authorization: `Bearer ${token}` },
              });

         toast.success(vaultId ? "Vault updated" : "Vault created");

         onSuccess(
            res.data.message?.messages?.[0] || res.data.message || res.data.data
         );
      } catch (err: any) {
         toast.error(
            err.response?.data?.message ||
               err.message ||
               "Failed to submit vault"
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: -15 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -15 }}
         transition={{ duration: 0.25 }}
         className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
      >
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
               <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Vault Message
                        </FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Write something for your future self..."
                              {...field}
                              className="resize-none rounded-md border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:outline-none"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="deliverAt"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="font-semibold text-gray-700 dark:text-gray-200">
                           Deliver At
                        </FormLabel>
                        <FormControl>
                           <Input
                              type="datetime-local"
                              {...field}
                              min={minDeliverAt}
                              onChange={onDeliverAtChange}
                              className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:outline-none rounded-md"
                           />
                        </FormControl>
                        {timeWarning && (
                           <p className="text-yellow-500 text-sm mt-1">
                              {timeWarning}
                           </p>
                        )}
                        <FormMessage />
                     </FormItem>
                  )}
               />

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
                     className="flex items-center justify-center gap-2"
                     disabled={loading}
                  >
                     {loading ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" /> Please
                           wait...
                        </>
                     ) : vaultId ? (
                        "Update Vault"
                     ) : (
                        "Add Vault"
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </motion.div>
   );
}
