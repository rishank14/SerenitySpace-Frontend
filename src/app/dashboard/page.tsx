"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFeatures from "@/components/dashboard/DashboardFeatures";
import DashboardStats from "@/components/dashboard/DashboardStats";

export default function DashboardPage() {
   return (
      <motion.section
         className="max-w-6xl mx-auto px-4 py-8 space-y-12"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, ease: "easeInOut" }}
      >
         <DashboardHeader />

         <Separator className="border-purple-300/40" />

         <DashboardFeatures />

         <Separator className="border-purple-300/40" />

         <DashboardStats />
      </motion.section>
   );
}
