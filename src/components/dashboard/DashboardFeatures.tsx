"use client";

import { Megaphone, Pencil, Mail } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

export default function DashboardFeatures() {
  return (
    <motion.section
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <FeatureCard
        title="Vent Room"
        description="Let it all out — anonymously or privately."
        href="/vent"
        icon={<Megaphone className="size-5" />}
      />
      <FeatureCard
        title="Reflection Space"
        description="Answer daily prompts to know yourself better."
        href="/reflection"
        icon={<Pencil className="size-5" />}
      />
      <FeatureCard
        title="Message Vault"
        description="Send messages to your future self."
        href="/message-vault"
        icon={<Mail className="size-5" />}
      />
    </motion.section>
  );
}
