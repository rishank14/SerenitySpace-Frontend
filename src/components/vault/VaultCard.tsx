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
   highlight?: boolean;
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
            initial={{ opacity: 0, y: 10 }}
            animate={{
               opacity: 1,
               y: 0,
               scale: showHighlight ? [1, 1.02, 1] : 1,
               boxShadow: showHighlight
                  ? "0 0 12px 3px rgba(52, 211, 153, 0.4)"
                  : "0 0 0 0 rgba(52, 211, 153, 0)",
               transition: { duration: 0.6, repeat: showHighlight ? 1 : 0 },
            }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl"
         >
            <Card className="relative transition-shadow dark:bg-gray-800 dark:text-gray-100">
               <CardHeader className="pb-2 flex flex-col gap-1">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                     Vault
                  </CardTitle>
                  <CardDescription className="line-clamp-4 text-gray-600 dark:text-gray-300 break-words">
                     {vault.message}
                  </CardDescription>
               </CardHeader>

               <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                     <span className="text-sm text-gray-500 dark:text-gray-400">
                        {vault.delivered ? "Delivered At: " : "Deliver At: "}
                        {formatDateTime(vault.deliverAt).replace(
                           /am|pm/i,
                           (m) => m.toUpperCase()
                        )}
                     </span>

                     {vault.delivered && (
                        <motion.span
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           className="text-xs sm:text-sm px-2 py-1 bg-green-500 dark:bg-green-600 text-white rounded-md font-medium shadow-sm"
                        >
                           Delivered
                        </motion.span>
                     )}
                  </div>

                  <div className="flex gap-2">
                     {onEdit && !vault.delivered && (
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => onEdit(vault)}
                           title="Edit Vault Message"
                           aria-label="Edit Vault Message"
                           className="hover:text-gray-700 dark:hover:text-gray-200"
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
                           className="hover:text-red-500"
                        >
                           <Trash size={16} />
                        </Button>
                     )}
                  </div>
               </CardContent>
            </Card>
         </motion.div>
      </AnimatePresence>
   );
}
