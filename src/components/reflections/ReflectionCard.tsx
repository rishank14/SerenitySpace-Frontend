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
import { formatDateTime } from "@/lib/formatDateTime";

export type Emotion = "happy" | "sad" | "angry" | "anxious" | "neutral";

export interface Reflection {
   _id: string;
   title?: string;
   content: string;
   emotion?: Emotion;
   tags?: string[];
   createdAt: string;
}

export interface ReflectionCardProps {
   reflection: Reflection;
   currentUserId?: string;
   onEdit?: (reflection: Reflection) => void;
   onDelete?: (reflectionId: string) => void;
}

const emotionClasses: Record<Emotion, string> = {
   happy: "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
   sad: "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
   angry: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100",
   anxious:
      "bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100",
   neutral: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export default function ReflectionCard({
   reflection,
   onEdit,
   onDelete,
}: ReflectionCardProps) {
   const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);

   const emotionBadge = reflection.emotion
      ? emotionClasses[reflection.emotion]
      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

   return (
      <motion.div
         layout
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         className="rounded-lg"
      >
         <Card className="relative overflow-hidden dark:bg-gray-800 dark:text-gray-100">
            {/* Emotion badge top-right */}
            {reflection.emotion && (
               <span
                  className={`absolute top-0 right-0 px-3 py-[6px] text-xs font-medium rounded-bl-md ${emotionBadge}`}
               >
                  {capitalize(reflection.emotion)}
               </span>
            )}

            <CardHeader className="pb-2">
               <CardTitle className="text-lg font-semibold truncate">
                  {reflection.title || "Untitled"}
               </CardTitle>
            </CardHeader>

            {/* Tags */}
            {reflection.tags?.length ? (
               <div className="px-4 flex flex-wrap gap-1">
                  {reflection.tags.map((tag) => (
                     <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            ) : null}

            <CardContent className="mt-2 flex flex-col gap-3">
               <CardDescription className="text-gray-700 dark:text-gray-200 break-words whitespace-pre-wrap">
                  {reflection.content}
               </CardDescription>

               <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>
                     {formatDateTime(reflection.createdAt).replace(
                        /am|pm/i,
                        (m) => m.toUpperCase()
                     )}
                  </span>

                  {(onEdit || onDelete) && (
                     <div className="flex gap-2">
                        {onEdit && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(reflection)}
                              title="Edit Reflection"
                              aria-label="Edit Reflection"
                              className="bg-transparent border-none hover:bg-transparent"
                           >
                              <Edit size={16} />
                           </Button>
                        )}
                        {onDelete && (
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(reflection._id)}
                              title="Delete Reflection"
                              aria-label="Delete Reflection"
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
