export function formatDateTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
