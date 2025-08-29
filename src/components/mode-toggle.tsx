"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ModeToggle() {
   const { resolvedTheme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);
   if (!mounted) return null;

   const isDark = resolvedTheme === "dark";

   return (
      <motion.div
         whileHover={{ scale: 1.15 }}
         whileTap={{ scale: 0.95 }}
         className="relative"
      >
         <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="relative w-10 h-10 flex items-center justify-center"
         >
            <AnimatePresence mode="wait">
               {isDark ? (
                  <motion.div
                     key="moon"
                     initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
                     animate={{ rotate: 0, scale: 1, opacity: 1 }}
                     exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
                     transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                        mass: 0.2,
                     }}
                     className="absolute"
                  >
                     <Moon className="h-5 w-5 text-white drop-shadow-md" />
                  </motion.div>
               ) : (
                  <motion.div
                     key="sun"
                     initial={{ rotate: 45, scale: 0.8, opacity: 0 }}
                     animate={{ rotate: 0, scale: 1, opacity: 1 }}
                     exit={{ rotate: -45, scale: 0.8, opacity: 0 }}
                     transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                        mass: 0.2,
                     }}
                     className="absolute"
                  >
                     <Sun className="h-5 w-5 text-yellow-400 drop-shadow-md" />
                  </motion.div>
               )}
            </AnimatePresence>
         </Button>

         {/* subtle hover glow */}
         <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            whileHover={{ boxShadow: "0 0 10px 2px rgba(167,139,250,0.5)" }}
         />
      </motion.div>
   );
}
