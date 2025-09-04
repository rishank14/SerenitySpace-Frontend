"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
   title: string;
   description: string;
   href: string;
   icon: React.ReactNode;
}

export default function FeatureCard({
   title,
   description,
   href,
   icon,
}: FeatureCardProps) {
   return (
      <motion.div
         whileHover={{ scale: 1.03 }}
         whileTap={{ scale: 0.97 }}
         initial={{ opacity: 0, y: 25 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, ease: "easeOut" }}
         className="h-44 md:h-48" // compact fixed height
      >
         <Link
            href={href}
            className="group flex flex-col justify-between rounded-xl border border-transparent bg-card p-6 shadow-md transition hover:shadow-lg hover:border-purple-400/40 h-full"
         >
            {/* Title + Icon */}
            <div className="flex items-center gap-4">
               <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-800 dark:text-purple-300">
                  {icon}
               </div>
               <h3 className="text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-300">
                  {title}
               </h3>
            </div>

            {/* Description + Arrow */}
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
               <p className="flex-1 pr-4">{description}</p>
               <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-all"
                  initial={{ x: -5 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 2 }}
               >
                  <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-300" />
               </motion.div>
            </div>
         </Link>
      </motion.div>
   );
}
