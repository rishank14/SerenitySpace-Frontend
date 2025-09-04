"use client";

import { Megaphone, Pencil, Mail } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { motion } from "framer-motion";

export default function DashboardFeatures() {
  return (
    <motion.section
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <FeatureCard
        title="Vent Room"
        description="A safe space to vent your thoughts and feelings, anonymously or privately."
        href="/vent"
        icon={<Megaphone className="w-5 h-5" />}
      />
      <FeatureCard
        title="Reflection Space"
        description="Keep a personal journal — reflect, explore your thoughts, and grow daily."
        href="/reflections"
        icon={<Pencil className="w-5 h-5" />}
      />
      <FeatureCard
        title="Message Vault"
        description="Send messages to your future self and revisit them later to see your growth."
        href="/vault"
        icon={<Mail className="w-5 h-5" />}
      />
    </motion.section>
  );
}
