"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHeader() {
   const { user, loading } = useAuth();

   return (
      <motion.div
         className="space-y-2"
         initial={{ opacity: 0, y: -15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
      >
         {loading ? (
            <div className="space-y-2">
               <Skeleton className="h-10 w-60 rounded-md" />
               <Skeleton className="h-5 w-72 rounded-md" />
            </div>
         ) : (
            <div className="space-y-1">
               <h2 className="text-4xl md:text-5xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                  Welcome back, {user?.username || "User"} !
               </h2>
               <p className="text-muted-foreground text-base">
                  Your personal sanctuary to vent, reflect, and feel heard.
               </p>
            </div>
         )}
      </motion.div>
   );
}
