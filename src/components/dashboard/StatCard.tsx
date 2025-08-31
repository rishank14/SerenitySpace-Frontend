import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/formatDateTime";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  content: string;
  timestamp?: string;
  type: "vent" | "reflection" | "message";
};

export default function StatCard({
  title,
  content,
  timestamp,
  type,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg border-border bg-card"
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
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
