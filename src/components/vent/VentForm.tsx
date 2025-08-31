"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
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

export type Mood = "sad" | "angry" | "anxious" | "happy" | "neutral";
export type Visibility = "public" | "private";

interface VentFormValues {
  message: string;
  mood: Mood;
  visibility: Visibility;
}

interface VentFormProps {
  ventId?: string;
  defaultValues?: Partial<VentFormValues>;
  onSuccess: (newVent?: any) => void;
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

  const form = useForm<VentFormValues>({
    defaultValues: {
      message: defaultValues?.message ?? "",
      mood: defaultValues?.mood ?? "neutral",
      visibility: defaultValues?.visibility ?? "public",
    },
  });

  const onSubmit: SubmitHandler<VentFormValues> = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      let res;

      if (ventId) {
        res = await axios.patch(`${baseUrl}/vents/update/${ventId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vent updated");
      } else {
        res = await axios.post(`${baseUrl}/vents/create`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vent created");
      }

      onSuccess(res.data.message);
      form.reset(values);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit vent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-lg">
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
                    placeholder="Write your vent..."
                    {...field}
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
                    className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {allowedMoods.map((m) => (
                      <option key={m} value={m}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait...
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
    </div>
  );
}
