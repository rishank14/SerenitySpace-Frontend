"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
   scrollToSection: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
   scrollToSection,
}) => {
   // Motion variants for reuse
   const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.15 } },
   };

   const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 },
   };

   const fadeUpSlight = {
      hidden: { opacity: 0, y: 40 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <section id="hero" className="relative overflow-hidden py-20 px-5 md:py-32">
         {/* Soft Gradient Background */}
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

         {/* Animated Floating Bubbles */}
         <motion.div
            className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.div
            className="absolute right-[10%] bottom-[15%] h-72 w-72 rounded-full bg-accent/10 blur-2xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         />

         <div className="container relative z-10">
            <motion.div
               initial="hidden"
               animate="show"
               variants={container}
               className="mx-auto max-w-4xl text-center"
            >
               {/* Tagline */}
               <motion.div variants={fadeUp}>
                  <Badge
                     variant="secondary"
                     className="mb-6 text-base py-1.5 px-3 rounded-md"
                  >
                     Your Mental Wellness Companion
                  </Badge>
               </motion.div>

               {/* Headline */}
               <motion.h1
                  className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance text-foreground"
                  variants={fadeUpSlight}
               >
                  Your safe space to{" "}
                  <motion.span
                     className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                     variants={fadeUp}
                     transition={{ delay: 0.2 }}
                  >
                     vent, reflect, and grow
                  </motion.span>
               </motion.h1>

               {/* Subtext */}
               <motion.p
                  className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty"
                  variants={fadeUp}
               >
                  A calming digital sanctuary for your mental wellbeing — vent
                  anonymously, reflect privately, send messages to your future
                  self, and receive gentle AI support.
               </motion.p>

               {/* Buttons */}
               <motion.div
                  className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                  variants={fadeUp}
               >
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button asChild size="lg" className="text-base px-8">
                        <Link href="/sign-up">
                           Get Started
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </Button>
                  </motion.div>

                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button
                        size="lg"
                        variant="outline"
                        className="text-base px-8 backdrop-blur-sm bg-background/70"
                        onClick={() => scrollToSection("#features")}
                     >
                        Learn More
                     </Button>
                  </motion.div>
               </motion.div>
            </motion.div>
         </div>
      </section>
   );
};
