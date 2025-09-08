import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import NavbarSwitcher from "@/components/layout/NavbarSwitcher";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "SerenitySpace",
   icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
   },
   description: "A calming mental health app",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               <AuthProvider>
                  <NavbarSwitcher />
                  <main className="pt-16">{children}</main>
                  <Footer />
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
               </AuthProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
