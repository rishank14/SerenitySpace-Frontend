"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import API from "@/lib/axios"; // <- Axios instance with token

type Vent = {
  message: string;
  createdAt: string;
};

type Reflection = {
  prompt: string;
  response: string;
  createdAt: string;
};

type Message = {
  message: string;
  deliverAt: string;
};

type DashboardData = {
  vents: Vent[];
  reflections: Reflection[];
  messageVault: {
    delivered: Message[];
    upcoming: Message[];
  };
};

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await API.get("/dashboard/"); // <- Axios GET
        setData(res.data?.message);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const latestVent = data?.vents?.[0];
  const latestReflection = data?.reflections?.[0];
  const latestMessage = data?.messageVault?.delivered?.[0];

  if (loading) {
    return (
      <motion.section
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StatCard title="Latest Vent" content="Loading..." type="vent" />
        <StatCard title="Latest Reflection" content="Loading..." type="reflection" />
        <StatCard title="Last Delivered Message" content="Loading..." type="message" />
      </motion.section>
    );
  }

  return (
    <motion.section
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StatCard
        title="Latest Vent"
        content={latestVent?.message || "You haven't vented yet."}
        timestamp={latestVent?.createdAt}
        type="vent"
      />
      <StatCard
        title="Latest Reflection"
        content={latestReflection?.response || "No reflections written yet."}
        timestamp={latestReflection?.createdAt}
        type="reflection"
      />
      <StatCard
        title="Last Delivered Message"
        content={latestMessage?.message || "No messages delivered yet."}
        timestamp={latestMessage?.deliverAt}
        type="message"
      />
    </motion.section>
  );
}
