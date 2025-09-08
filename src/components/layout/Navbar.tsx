"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/user/UserMenu";

const links = ["vent", "reflections", "vault"];

export default function Navbar() {
   const pathname = usePathname();
   const [menuOpen, setMenuOpen] = useState(false);
   const { user } = useAuth();

   const isLinkActive = (link: string) => pathname === `/${link}`;

   return (
      <motion.nav
         className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-md transition-colors"
         initial={{ opacity: 0, y: -30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-x-4">
               {/* Logo */}
               <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 flex-shrink-0 min-w-0"
               >
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.97 }}
                     className="flex items-center cursor-pointer space-x-2"
                  >
                     <Image
                        src="/logo.png"
                        alt="SerenitySpace Logo"
                        width={50}
                        height={50}
                     />
                     <span className="text-lg sm:text-2xl font-bold text-primary dark:text-purple-300 transition-colors duration-300">
                        SerenitySpace
                     </span>
                  </motion.div>
               </Link>

               {/* Desktop Links */}
               {user && (
                  <div className="hidden md:flex flex-1 justify-center relative">
                     <div className="flex space-x-12 lg:space-x-16 relative">
                        {links.map((link) => (
                           <Link
                              key={link + pathname}
                              href={`/${link}`}
                              aria-current={
                                 isLinkActive(link) ? "page" : undefined
                              }
                              className="relative"
                           >
                              <motion.span
                                 whileHover={{
                                    scale: 1.07,
                                    color: "#A78BFA",
                                    textShadow: "0 0 6px #A78BFA",
                                 }}
                                 transition={{ duration: 0.2 }}
                                 className={`text-lg font-semibold cursor-pointer transition-colors duration-300 ${
                                    isLinkActive(link)
                                       ? "text-purple-600 dark:text-purple-400"
                                       : "text-gray-700 dark:text-gray-200 hover:text-purple-600"
                                 }`}
                              >
                                 {link.charAt(0).toUpperCase() + link.slice(1)}
                              </motion.span>

                              {isLinkActive(link) && (
                                 <motion.div
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 w-full h-1 bg-purple-500 rounded-full"
                                    transition={{
                                       type: "spring",
                                       stiffness: 500,
                                       damping: 30,
                                    }}
                                 />
                              )}
                           </Link>
                        ))}
                     </div>
                  </div>
               )}

               {/* Right side */}
               <div className="flex items-center space-x-4">
                  <motion.div
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <ModeToggle />
                  </motion.div>

                  {user && <UserMenu />}

                  {/* Mobile Menu Toggle */}
                  {user && (
                     <div className="md:hidden">
                        <motion.button
                           onClick={() => setMenuOpen((prev) => !prev)}
                           whileTap={{ scale: 0.95 }}
                           className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
                           aria-label="Toggle menu"
                           aria-expanded={menuOpen}
                        >
                           {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Mobile Menu (Instant toggle with sliding underline) */}
         {menuOpen && user && (
            <div className="md:hidden px-6 pt-4 pb-6 bg-white dark:bg-gray-900 backdrop-blur-md rounded-b-lg">
               <div className="flex flex-col items-center space-y-4 w-full relative">
                  {links.map((link) => (
                     <Link
                        key={link + pathname + "mobile"}
                        href={`/${link}`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isLinkActive(link) ? "page" : undefined}
                        className="relative w-full text-center"
                     >
                        <span
                           className={`text-lg font-semibold transition-colors duration-300 cursor-pointer ${
                              isLinkActive(link)
                                 ? "text-purple-600 dark:text-purple-400"
                                 : "text-gray-700 dark:text-gray-200"
                           }`}
                        >
                           {link.charAt(0).toUpperCase() + link.slice(1)}
                        </span>

                        {isLinkActive(link) && (
                           <motion.div
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="absolute -bottom-1 left-1/4 w-1/2 h-1 bg-purple-500 rounded-full origin-center"
                           />
                        )}
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </motion.nav>
   );
}
