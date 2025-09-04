"use client";

import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
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
   currentUserId?: string;
   onEdit?: (vent: Vent) => void;
   onDelete?: (ventId: string) => void;
   highlight?: boolean;
}

const moodClasses: Record<Mood, string> = {
   happy: "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
   sad: "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
   angry: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100",
   anxious:
      "bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100",
   neutral: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const visibilityClasses: Record<Visibility, string> = {
   public: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
   private: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export default function VentCard({
   vent,
   currentUserId,
   onEdit,
   onDelete,
   highlight = false,
}: VentCardProps) {
   const username = vent.user?.username ?? "Anonymous";
   const isMine = vent.user?._id === currentUserId;

   const moodBadge = vent.mood ? moodClasses[vent.mood] : "";
   const visibilityBadge = vent.visibility
      ? visibilityClasses[vent.visibility]
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

   const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

   return (
      <motion.div
         layout
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         className={
            highlight
               ? "ring-2 ring-blue-400 dark:ring-blue-600 rounded-lg transition-all"
               : ""
         }
      >
         <Card className="relative overflow-hidden dark:bg-gray-800 dark:text-gray-100">
            {vent.visibility && (
               <span
                  className={`absolute top-0 right-0 px-3 py-[6px] text-xs font-medium rounded-bl-md ${visibilityBadge}`}
               >
                  {capitalize(vent.visibility)}
               </span>
            )}

            <CardHeader className="flex justify-between items-start gap-2">
               <CardTitle className="text-lg font-semibold truncate">
                  {username}
               </CardTitle>
            </CardHeader>

            {vent.mood && (
               <div className="px-4">
                  <span
                     className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${moodBadge}`}
                  >
                     {capitalize(vent.mood)}
                  </span>
               </div>
            )}

            <CardContent className="mt-2 flex flex-col gap-3">
               <CardDescription className="text-gray-700 dark:text-gray-200 break-words whitespace-pre-wrap">
                  {vent.message}
               </CardDescription>

               <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>
                     {vent.updatedAt
                        ? format(new Date(vent.updatedAt), "PPP, p")
                        : "Unknown date"}
                  </span>

                  {isMine && (onEdit || onDelete) && (
                     <div className="flex gap-2">
                        {onEdit && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(vent)}
                              title="Edit Vent"
                              aria-label="Edit Vent"
                              className="bg-transparent border-none hover:bg-transparent"
                           >
                              <Edit size={16} />
                           </Button>
                        )}
                        {onDelete && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(vent._id)}
                              title="Delete Vent"
                              aria-label="Delete Vent"
                              className="bg-transparent border-none hover:bg-transparent hover:text-red-500"
                           >
                              <Trash size={16} />
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>
      </motion.div>
   );
}
