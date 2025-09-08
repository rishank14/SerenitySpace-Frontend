"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export const CTASection: React.FC = () => {
   return (
      <motion.section
         id="get-started"
         className="py-20 px-5 md:py-32 bg-background"
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         viewport={{ once: true, amount: 0.3 }}
      >
         <div className="container">
            <div className="mx-auto max-w-4xl text-center">
               <motion.h2
                  className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
               >
                  Ready to find your calm?
               </motion.h2>
               <motion.p
                  className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
               >
                  Join thousands who’ve found peace, clarity, and emotional
                  growth with SerenitySpace. Your journey to better mental
                  wellness starts today.
               </motion.p>

               <motion.div
                  className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                  >
                     <Button asChild size="lg" className="text-base px-8">
                        <Link href="/sign-up">
                           Join the Calm
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </Button>
                  </motion.div>

                  <div className="flex items-center text-sm text-muted-foreground mt-2 sm:mt-0">
                     <Shield className="mr-2 h-4 w-4" />
                     Free to start
                  </div>
               </motion.div>
            </div>
         </div>
      </motion.section>
   );
};
