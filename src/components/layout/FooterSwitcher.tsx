"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export default function FooterSwitcher() {
   const pathname = usePathname();

   // Hide footer on auth pages
   if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
      return null;
   }

   return <Footer />;
}
