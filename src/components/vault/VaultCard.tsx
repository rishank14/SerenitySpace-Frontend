"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/formatDateTime";

export interface Vault {
  _id: string;
  message: string;
  deliverAt: string;
  delivered: boolean;
}

interface VaultCardProps {
  vault: Vault;
  onEdit?: (vault: Vault) => void;
  onDelete?: (vaultId: string) => void;
  highlight?: boolean; // initially delivered recently
}

export default function VaultCard({
  vault,
  onEdit,
  onDelete,
  highlight = false,
}: VaultCardProps) {
  const [showHighlight, setShowHighlight] = useState(highlight);

  useEffect(() => {
    if (highlight) {
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
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="rounded-lg"
          animate={{
            boxShadow: showHighlight
              ? "0 0 12px 4px rgba(52, 211, 153, 0.6)"
              : "0 0 0 0 rgba(52, 211, 153, 0)",
            transition: {
              duration: 0.8,
              repeat: showHighlight ? 2 : 0,
              repeatType: "mirror",
            },
          }}
        >
          <Card className="relative hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-gray-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vault Message</CardTitle>
              <CardDescription className="line-clamp-3 mt-2 text-gray-600 dark:text-gray-300">
                {vault.message}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {vault.delivered ? "Delivered At: " : "Deliver At: "}
                {formatDateTime(vault.deliverAt).replace(/am|pm/i, (m) => m.toUpperCase())}
              </span>
              <div className="flex gap-2">
                {onEdit && !vault.delivered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vault)}
                    title="Edit Vault Message"
                    aria-label="Edit Vault Message"
                  >
                    <Edit size={16} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(vault._id)}
                    title="Delete Vault Message"
                    aria-label="Delete Vault Message"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </CardContent>

            {vault.delivered && (
              <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-full">
                Delivered
              </span>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
