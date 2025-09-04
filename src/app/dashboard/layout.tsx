"use client";

import { motion } from "framer-motion";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

interface DashboardLayoutProps {
   children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
   return (
      <>
         {children}

         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
         >
            <ChatbotWidget />
         </motion.div>
      </>
   );
}
