import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      {children}
      <Toaster
                     position="bottom-right"
                     richColors
                     toastOptions={{
                        classNames: {
                           toast: "rounded-md border shadow-lg bg-background text-foreground",
                           title: "font-semibold",
                           description: "text-muted-foreground text-sm",
                           actionButton: "text-primary",
                           cancelButton: "text-muted",
                        },
                     }}
                  />
    </div>
  );
}
