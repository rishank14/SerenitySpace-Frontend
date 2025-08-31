"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export type Mood = "sad" | "angry" | "anxious" | "happy" | "neutral";
export type Visibility = "public" | "private";

export interface Vent {
  _id: string;
  message: string;
  mood?: Mood;
  visibility?: Visibility;
  user?: { _id: string; username?: string };
  updatedAt: string;
}

export interface VentCardProps {
  vent: Vent;
  currentUserId?: string; // ✅ needed to show buttons
  onEdit?: (vent: Vent) => void;
  onDelete?: (ventId: string) => void;
  highlight?: boolean;
}

export default function VentCard({
  vent,
  currentUserId,
  onEdit,
  onDelete,
  highlight = false,
}: VentCardProps) {
  const username = vent.user?.username ?? "Anonymous";
  const isMine = vent.user?._id === currentUserId; // ✅ this must match your logged-in user id

  const visibilityBadge =
    vent.visibility === "public"
      ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
      : vent.visibility === "private"
      ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  const moodBadge =
    vent.mood === "happy"
      ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
      : vent.mood === "sad"
      ? "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
      : vent.mood === "angry"
      ? "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
      : vent.mood === "anxious"
      ? "bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100"
      : vent.mood === "neutral"
      ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={highlight ? "ring-2 ring-blue-400 dark:ring-blue-600 rounded-lg transition-all" : ""}
    >
      <Card className="relative hover:shadow-xl transition-shadow dark:bg-gray-800 dark:text-gray-100">
        {/* Header: username + visibility badge */}
        <CardHeader className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold truncate">{username}</CardTitle>
          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${visibilityBadge}`}>
            {(vent.visibility ?? "unknown").toUpperCase()}
          </span>
        </CardHeader>

        {/* Mood badge */}
        {vent.mood && (
          <div className="px-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${moodBadge}`}>
              {vent.mood.charAt(0).toUpperCase() + vent.mood.slice(1)}
            </span>
          </div>
        )}

        {/* Message content */}
        <CardContent className="mt-2 flex flex-col gap-3">
          <CardDescription className="text-gray-700 dark:text-gray-200 break-words whitespace-pre-wrap">
            {vent.message}
          </CardDescription>

          {/* Footer: date + edit/delete */}
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{format(new Date(vent.updatedAt), "PPP, p")}</span>
            <div className="flex gap-2">
              {onEdit && isMine && (
                <Button variant="outline" size="sm" onClick={() => onEdit(vent)} title="Edit">
                  <Edit size={16} />
                </Button>
              )}
              {onDelete && isMine && (
                <Button variant="outline" size="sm" onClick={() => onDelete(vent._id)} title="Delete">
                  <Trash size={16} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
