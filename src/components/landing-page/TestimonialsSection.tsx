"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
   const testimonials = [
      {
         rating: 5,
         text: `The Vent Room has been a lifesaver during anxiety, giving a safe space to release emotions without judgment. It helped me process feelings I couldn’t share anywhere else.`,
         initial: "A",
         name: "Anonymous User",
         role: "College Student",
      },
      {
         rating: 5,
         text: `SerenityBot feels like having a therapist available 24/7. The AI responses are surprisingly empathetic and have helped me work through some difficult moments.`,
         initial: "M",
         name: "Anonymous User",
         role: "Working Professional",
      },
      {
         rating: 5,
         text: `The Message Vault feature is incredible. Writing letters to my future self has become a powerful tool for setting intentions and tracking my emotional growth over time.`,
         initial: "S",
         name: "Anonymous User",
         role: "Parent",
      },
   ];

   const container = {
      hidden: {},
      show: {
         transition: { staggerChildren: 0.15 },
      },
   };

   const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <section id="testimonials" className="py-20 px-5 md:py-32">
         <motion.div
            className="container mx-auto text-center max-w-2xl mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
         >
            <motion.h2
               className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               Trusted by thousands finding peace
            </motion.h2>
            <motion.p
               className="mt-4 text-lg text-muted-foreground text-pretty"
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
               Real stories from people who found their calm with SerenitySpace.
            </motion.p>
         </motion.div>

         <motion.div
            className="grid gap-6 sm:gap-8 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
         >
            {testimonials.map((t, idx) => (
               <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 120 }}
               >
                  <Card className="border-border/50 shadow-sm hover:shadow-lg transition-shadow duration-300">
                     <CardContent className="pt-6">
                        <motion.div
                           className="flex items-center mb-4 justify-center"
                           initial={{ opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5 }}
                        >
                           {[...Array(t.rating)].map((_, i) => (
                              <Star
                                 key={i}
                                 className="h-4 w-4 fill-primary text-primary"
                              />
                           ))}
                        </motion.div>

                        <motion.p
                           className="text-muted-foreground mb-4 text-pretty"
                           initial={{ opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: 0.1 }}
                        >
                           {t.text}
                        </motion.p>

                        <motion.div
                           className="flex items-center justify-center"
                           initial={{ opacity: 0, y: 10 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: 0.2 }}
                        >
                           <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                 {t.initial}
                              </span>
                           </div>
                           <div className="ml-3 text-left">
                              <p className="text-sm font-medium">{t.name}</p>
                              <p className="text-xs text-muted-foreground">
                                 {t.role}
                              </p>
                           </div>
                        </motion.div>
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </motion.div>
      </section>
   );
}
