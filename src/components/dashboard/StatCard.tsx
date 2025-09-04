"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatDateTime";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  content: string;
  timestamp?: string;
  type?: "vent" | "reflection" | "message";
};

export default function StatCard({
  title,
  content,
  timestamp,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all border border-purple-400 bg-card hover:shadow-purple-300/40 hover:shadow-lg"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg text-black dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {content.length > 120 ? content.slice(0, 120) + "..." : content}
        </p>
        {timestamp && (
          <p className="text-xs text-right text-muted-foreground mt-2">
            {formatDateTime(timestamp)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
