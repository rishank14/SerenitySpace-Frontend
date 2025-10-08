"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface Step {
   number: number;
   title: string;
   description: string;
}

const steps: Step[] = [
   {
      number: 1,
      title: "Sign Up",
      description:
         "Create your account in seconds with just an email. Your privacy and anonymity are always protected.",
   },
   {
      number: 2,
      title: "Choose Your Tool",
      description:
         "Select from our four wellness features based on your needs: venting, reflection, future messages, or AI support.",
   },
   {
      number: 3,
      title: "Feel Better",
      description:
         "Experience relief and growth from having a safe space to process your emotions and thoughts.",
   },
];

export const HowItWorksSection: React.FC = () => {
   const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.15 } },
   };

   const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <section id="how-it-works" className="py-20 px-5 md:py-32 bg-muted/30">
         <div className="container">
            {/* Section Header with Motion */}
            <motion.div
               className="mx-auto max-w-2xl text-center mb-16"
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, amount: 0.3 }}
               variants={{ show: { transition: { staggerChildren: 0.15 } } }}
            >
               <motion.h2
                  className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
               >
                  Simple steps to better mental health
               </motion.h2>
               <motion.p
                  className="mt-4 text-lg text-muted-foreground text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  Getting started with SerenitySpace is simple and takes just a
                  few minutes.
               </motion.p>
            </motion.div>

            {/* Steps Grid */}
            <motion.div
               className="grid gap-8 md:grid-cols-3"
               variants={container}
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, amount: 0.3 }}
            >
               {steps.map((step) => (
                  <motion.div
                     key={step.number}
                     className="text-center"
                     variants={fadeUp}
                  >
                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                        {step.number}
                     </div>
                     <motion.h3
                        className="text-xl font-semibold mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                     >
                        {step.title}
                     </motion.h3>
                     <motion.p
                        className="text-muted-foreground text-pretty"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                     >
                        {step.description}
                     </motion.p>
                  </motion.div>
               ))}
            </motion.div>
         </div>
      </section>
   );
};
