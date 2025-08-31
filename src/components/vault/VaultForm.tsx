"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
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

// 🕒 Helper: Current IST time formatted for datetime-local input
function getCurrentISTLocalDateTime(): string {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const offset = ist.getTimezoneOffset(); // should be -330
  const localIST = new Date(ist.getTime() - offset * 60 * 1000);
  return localIST.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

// 🕒 Helper: Convert backend UTC to IST for datetime-local input
function convertUTCtoISTLocal(utcStr: string) {
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
}

interface VaultFormProps {
  vaultId?: string;
  defaultValues?: {
    message: string;
    deliverAt: string;
  };
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

  const form = useForm({
    defaultValues: {
      message: defaultValues?.message || "",
      deliverAt: defaultValues?.deliverAt
        ? convertUTCtoISTLocal(defaultValues.deliverAt)
        : getCurrentISTLocalDateTime(),
    },
  });

  const onSubmit = async (values: any) => {
    const selectedDate = new Date(values.deliverAt);
    const now = new Date();
    now.setSeconds(0, 0); // remove seconds/milliseconds

    // ✅ Validate future time
    if (selectedDate <= now) {
      toast.error("Deliver time must be at least 1 minute in the future.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      // Convert IST input to UTC before sending to backend
      const deliverAtUTC = new Date(values.deliverAt).toISOString();

      const payload = {
        message: values.message,
        deliverAt: deliverAtUTC,
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      let res;

      if (vaultId) {
        res = await axios.patch(
          `${baseUrl}/message-vault/update/${vaultId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Vault updated");
      } else {
        res = await axios.post(`${baseUrl}/message-vault/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vault created");
      }

      onSuccess(
        res.data.message.messages?.[0] || res.data.message || res.data.data
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to submit vault"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your vault message..." {...field} />
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
                <FormLabel>Deliver At</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    min={getCurrentISTLocalDateTime()} // prevent past times
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait...
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
    </div>
  );
}
