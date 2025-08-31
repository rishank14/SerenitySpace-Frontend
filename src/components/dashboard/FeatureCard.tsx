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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-primary/50"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>{description}</p>
          <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition" />
        </div>
      </Link>
    </motion.div>
  );
}
