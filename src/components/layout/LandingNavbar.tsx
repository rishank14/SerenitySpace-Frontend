"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

const links = [
   { label: "Features", href: "#features" },
   { label: "How It Works", href: "#how-it-works" },
   { label: "Testimonials", href: "#testimonials" },
   { label: "FAQ", href: "#faq" },
];

export default function LandingNavbar() {
   const [menuOpen, setMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<string>("");
   const router = useRouter();

   // Track scroll to highlight current section
   useEffect(() => {
      const handleScroll = () => {
         const scrollPos = window.scrollY + window.innerHeight / 2;
         let current = "";
         links.forEach(({ href }) => {
            const section = document.querySelector(href);
            if (section) {
               const offsetTop = (section as HTMLElement).offsetTop;
               const offsetHeight = (section as HTMLElement).offsetHeight;
               if (
                  scrollPos >= offsetTop &&
                  scrollPos < offsetTop + offsetHeight
               ) {
                  current = href;
               }
            }
         });
         setActiveSection(current);
      };

      handleScroll(); // initial check
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   // Smooth scroll helper
   const scrollToSection = (href: string) => {
      const section = document.querySelector(href);
      if (section) {
         (section as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "start",
         });
         setMenuOpen(false);
      }
   };

   return (
      <motion.nav
         className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md transition-colors"
         initial={{ opacity: 0, y: -30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
      >
         <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between items-center h-16">
               {/* Logo */}
               <div
                  className="flex items-center space-x-2 flex-1 cursor-pointer"
                  onClick={() => scrollToSection("#hero")}
               >
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.97 }}
                     className="flex items-center space-x-2"
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
               </div>

               {/* Desktop Links */}
               <div className="hidden md:flex space-x-8 flex-1 justify-center">
                  {links.map(({ label, href }) => {
                     const isActive = activeSection === href;
                     return (
                        <div
                           key={label}
                           className="relative flex flex-col items-center cursor-pointer"
                           onClick={() => scrollToSection(href)}
                        >
                           <motion.span
                              whileHover={{
                                 scale: 1.08,
                                 color: "#A78BFA",
                                 textShadow: "0 0 6px #A78BFA",
                              }}
                              transition={{ duration: 0.2 }}
                              className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                           >
                              {label}
                           </motion.span>
                           {isActive && (
                              <motion.div
                                 layoutId="nav-underline"
                                 className="absolute -bottom-2 w-3/4 h-1.5 bg-purple-500 rounded-full"
                                 transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                 }}
                              />
                           )}
                        </div>
                     );
                  })}
               </div>

               {/* Right Side */}
               <div className="flex items-center space-x-4 flex-1 justify-end">
                  <motion.div
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <ModeToggle />
                  </motion.div>

                  <div
                     onClick={() => router.push("/sign-in")}
                     className="hidden md:inline-block px-5 py-2 rounded-full text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                     Sign In
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="md:hidden">
                     <motion.button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
                        aria-label="Toggle menu"
                     >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                     </motion.button>
                  </div>
               </div>
            </div>
         </div>

         {/* Mobile Menu */}
         <AnimatePresence>
            {menuOpen && (
               <motion.div
                  className="md:hidden bg-white dark:bg-gray-900 backdrop-blur-md absolute top-16 left-0 w-full z-40 shadow-lg rounded-b-lg overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
               >
                  <div className="flex flex-col items-center space-y-4 px-6 py-6">
                     {links.map(({ label, href }) => {
                        const isActive = activeSection === href;
                        return (
                           <div
                              key={label}
                              className="relative flex flex-col items-center cursor-pointer"
                              onClick={() => {
                                 setMenuOpen(false);
                                 setTimeout(() => scrollToSection(href), 100); // delay scroll so menu closes first
                              }}
                           >
                              <motion.span
                                 whileHover={{
                                    scale: 1.05,
                                    color: "#A78BFA",
                                    textShadow: "0 0 5px #A78BFA",
                                 }}
                                 transition={{ duration: 0.2 }}
                                 className="text-base font-semibold text-gray-700 dark:text-gray-200"
                              >
                                 {label}
                              </motion.span>
                              {isActive && (
                                 <motion.div
                                    layoutId="mobile-underline"
                                    className="absolute -bottom-2 w-3/4 h-1.5 bg-purple-500 rounded-full"
                                    transition={{
                                       type: "spring",
                                       stiffness: 500,
                                       damping: 30,
                                    }}
                                 />
                              )}
                           </div>
                        );
                     })}

                     <div
                        onClick={() => {
                           setMenuOpen(false);
                           setTimeout(() => router.push("/sign-in"), 100);
                        }}
                        className="px-6 py-2 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
                     >
                        Sign In
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.nav>
   );
}
