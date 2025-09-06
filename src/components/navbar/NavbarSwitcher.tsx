"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import LandingNavbar from "./LandingNavbar";

export default function NavbarSwitcher() {
   const pathname = usePathname();
   const [mounted, setMounted] = useState(false);

   // Only run on client to avoid hydration errors
   useEffect(() => setMounted(true), []);

   if (!mounted) return null;

   // Show LandingNavbar only on home page
   if (pathname === "/") return <LandingNavbar />;

   return <Navbar />;
}
