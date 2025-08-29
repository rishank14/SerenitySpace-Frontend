"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["vent", "reflections", "vault"];

export default function Navbar() {
   const [menuOpen, setMenuOpen] = useState(false);
   const pathname = usePathname();

   return (
      <motion.nav
         className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed w-full z-50 transition-colors"
         initial={{ opacity: 0, y: -30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
      >
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
               {/* Logo + Brand */}
               <Link href="/" className="flex items-center space-x-2 flex-1">
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.97 }}
                     className="flex items-center space-x-2 cursor-pointer"
                  >
                     <Image
                        src="/logo.png"
                        alt="SerenitySpace Logo"
                        width={40}
                        height={40}
                     />
                     <span className="text-2xl font-bold text-primary dark:text-purple-300">
                        SerenitySpace
                     </span>
                  </motion.div>
               </Link>

               {/* Desktop Links */}
               <div className="hidden md:flex space-x-14 justify-center flex-1">
                  {links.map((link) => {
                     const isActive = pathname === `/${link}`;
                     return (
                        <Link key={link} href={`/${link}`}>
                           <motion.span
                              whileHover={{
                                 scale: 1.07,
                                 color: "#A78BFA",
                                 textShadow: "0 0 5px #A78BFA",
                              }}
                              transition={{ duration: 0.2 }}
                              className={`text-lg font-semibold transition-colors duration-300 ${
                                 isActive
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-gray-700 dark:text-gray-200"
                              }`}
                           >
                              {link.charAt(0).toUpperCase() + link.slice(1)}
                           </motion.span>
                        </Link>
                     );
                  })}
               </div>

               {/* Right: ModeToggle + Logout + Hamburger */}
               <div className="flex items-center space-x-4 flex-1 justify-end">
                  <motion.div
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <ModeToggle />
                  </motion.div>

                  <motion.button
                     whileHover={{ scale: 1.1, boxShadow: "0 0 10px #A78BFA" }}
                     whileTap={{ scale: 0.95 }}
                     className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 dark:bg-purple-400 text-white transition-colors duration-300"
                     aria-label="Logout"
                  >
                     <LogOut size={20} />
                  </motion.button>

                  {/* Mobile Menu Toggle */}
                  <div className="md:hidden">
                     <motion.button
                        onClick={() => setMenuOpen(!menuOpen)}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
                        aria-label="Toggle Menu"
                     >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                     </motion.button>
                  </div>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         <AnimatePresence>
            {menuOpen && (
               <motion.div
                  className="md:hidden px-4 pt-4 pb-6 bg-white dark:bg-gray-900 backdrop-blur-md overflow-hidden rounded-b-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
               >
                  <div className="flex flex-col items-center space-y-4">
                     {links.map((link) => {
                        const isActive = pathname === `/${link}`;
                        return (
                           <Link
                              key={link}
                              href={`/${link}`}
                              onClick={() => setMenuOpen(false)}
                           >
                              <motion.span
                                 whileHover={{
                                    scale: 1.05,
                                    color: "#A78BFA",
                                    textShadow: "0 0 5px #A78BFA",
                                 }}
                                 transition={{ duration: 0.2 }}
                                 className={`text-lg font-semibold transition-colors duration-300 ${
                                    isActive
                                       ? "text-purple-600 dark:text-purple-400"
                                       : "text-gray-700 dark:text-gray-200"
                                 }`}
                              >
                                 {link.charAt(0).toUpperCase() + link.slice(1)}
                              </motion.span>
                           </Link>
                        );
                     })}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.nav>
   );
}
