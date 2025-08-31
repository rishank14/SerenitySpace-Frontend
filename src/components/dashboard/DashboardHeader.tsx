"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`,
          { credentials: "include" }
        );

        const data = await res.json();
        setUsername(data?.message?.vents?.[0]?.user?.username || "User");
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {loading ? (
        <>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-5 w-[300px]" />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {username} 👋
          </h2>
          <p className="text-muted-foreground">
            This is your safe space. Reflect, vent, and breathe freely.
          </p>
        </>
      )}
    </motion.div>
  );
}
