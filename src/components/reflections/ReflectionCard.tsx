"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/formatDateTime";

export interface Reflection {
  _id: string;
  title?: string;
  content: string;
  emotion?: string;
  tags?: string[];
  createdAt: string;
}

export interface ReflectionCardProps {
  reflection: Reflection;
  onEdit?: (reflection: Reflection) => void;
  onDelete?: (reflectionId: string) => void;
  highlight?: boolean; // pulsating highlight
}

export default function ReflectionCard({
  reflection,
  onEdit,
  onDelete,
  highlight = false,
}: ReflectionCardProps) {
  const [showHighlight, setShowHighlight] = useState(highlight);

  // Automatically remove highlight after 3 seconds
  useEffect(() => {
    if (highlight) {
      setShowHighlight(true);
      const timer = setTimeout(() => setShowHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlight]);

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative rounded-lg`}
      >
        <motion.div
          animate={
            showHighlight
              ? { boxShadow: ["0 0 0px rgba(59, 130, 246, 0.5)", "0 0 12px rgba(59, 130, 246, 0.7)", "0 0 0px rgba(59, 130, 246, 0.5)"] }
              : {}
          }
          transition={{ duration: 1, repeat: showHighlight ? 3 : 0 }}
          className="rounded-lg"
        >
          <Card className="relative hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-gray-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {reflection.title || "Untitled"}
              </CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-gray-600 dark:text-gray-300">
                {reflection.content}
              </CardDescription>
            </CardHeader>

            {/* Tags */}
            {reflection.tags?.length ? (
              <div className="px-4 mt-2 flex flex-wrap gap-1">
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

            <CardContent className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(reflection.createdAt).replace(/am|pm/i, (m) =>
                  m.toUpperCase()
                )}
              </span>
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(reflection)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(reflection._id)}
                    title="Delete"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </CardContent>

            {/* Emotion badge */}
            {reflection.emotion && (
              <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
                {reflection.emotion}
              </span>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
