"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/formatDateTime"; // IST formatting helper

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
  highlight?: boolean; // new prop for temporary highlight
}

export default function ReflectionCard({
  reflection,
  onEdit,
  onDelete,
  highlight = false,
}: ReflectionCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={highlight ? "ring-2 ring-blue-400 dark:ring-blue-600 rounded-lg transition-all" : ""}
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
        <CardContent className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateTime(reflection.createdAt)} {/* IST-formatted */}
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
        {reflection.emotion && (
          <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
            {reflection.emotion}
          </span>
        )}
      </Card>
    </motion.div>
  );
}
