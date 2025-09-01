"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import API from "@/lib/axios";

// 🕒 Helper: Current IST time +1 minute formatted for datetime-local input
function getCurrentISTLocalDateTimePlus1(): string {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  ist.setMinutes(ist.getMinutes() + 1); // add 1 min
  const offset = ist.getTimezoneOffset();
  const localIST = new Date(ist.getTime() - offset * 60 * 1000);
  return localIST.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

// 🕒 Helper: Convert backend UTC to IST for datetime-local input
function convertUTCtoISTLocal(utcStr?: string) {
  if (!utcStr) return getCurrentISTLocalDateTimePlus1();
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
  const [timeWarning, setTimeWarning] = useState<string>("");

  const form = useForm({
    defaultValues: {
      message: defaultValues?.message || "",
      deliverAt: defaultValues?.deliverAt
        ? convertUTCtoISTLocal(defaultValues.deliverAt)
        : getCurrentISTLocalDateTimePlus1(),
    },
  });

  // Handle datetime-local input change
  const onDeliverAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("deliverAt", value);

    if (!value) {
      setTimeWarning("⚠ Deliver time required.");
      return;
    }

    const selectedDate = new Date(value);
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMinutes(now.getMinutes() + 1); // ensure minimum 1 min

    if (selectedDate < now) {
      setTimeWarning("⚠ Deliver time must be at least 1 minute in the future.");
    } else {
      setTimeWarning("");
    }
  };

  const onSubmit = async (values: any) => {
    if (!values.deliverAt) {
      toast.error("Please select a deliver time.");
      return;
    }

    const selectedDate = new Date(values.deliverAt);
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMinutes(now.getMinutes() + 1); // min 1 min ahead

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
        deliverAt: new Date(values.deliverAt).toISOString(), // IST → UTC
      };

      let res;
      if (vaultId) {
        res = await API.patch(`/message-vault/update/${vaultId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vault updated");
      } else {
        res = await API.post("/message-vault/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vault created");
      }

      onSuccess(res.data.message.messages?.[0] || res.data.message || res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to submit vault");
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
                    min={getCurrentISTLocalDateTimePlus1()}
                    onChange={onDeliverAtChange}
                  />
                </FormControl>
                {timeWarning && (
                  <p className="text-yellow-500 text-sm mt-1">{timeWarning}</p>
                )}
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
