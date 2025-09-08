"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { MessageCircle, BookOpen, Clock, Bot } from "lucide-react";

interface Feature {
   title: string;
   description: string;
   icon: React.ReactNode;
}

const features: Feature[] = [
   {
      title: "Vent Room",
      description:
         "Express your emotions anonymously or privately in a safe, judgment-free space designed for emotional release.",
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
   },
   {
      title: "Reflection Space",
      description:
         "Private journaling and emotional tracking to help you understand, process, and grow from your feelings.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
   },
   {
      title: "Message Vault",
      description:
         "Send messages to your future self with scheduled delivery and real-time popups for motivation, reflection, and growth.",
      icon: <Clock className="h-6 w-6 text-primary" />,
   },
   {
      title: "SerenityBot",
      description:
         "AI companion trained in emotional support, offering guidance, comfort, and empathetic advice whenever you need it.",
      icon: <Bot className="h-6 w-6 text-primary" />,
   },
];

export const FeaturesSection: React.FC = () => {
   const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.15 } },
   };

   const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <section id="features" className="py-20 px-5 md:py-32">
         <div className="container">
            {/* Section Header */}
            <motion.div
               className="mx-auto max-w-2xl text-center mb-16"
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
                  Everything you need for mental wellness
               </motion.h2>
               <motion.p
                  className="mt-4 text-lg text-muted-foreground text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  Four essential tools designed to support your emotional
                  journey, nurture self-awareness, and promote mental wellbeing.
               </motion.p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
               className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
               variants={container}
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, amount: 0.3 }}
            >
               {features.map((feature, index) => (
                  <motion.div
                     key={index}
                     variants={fadeUp}
                     whileHover={{ scale: 1.03 }}
                     transition={{ type: "spring", stiffness: 120 }}
                  >
                     <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
                        <CardHeader className="text-center pb-4">
                           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              {feature.icon}
                           </div>
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                           >
                              <CardTitle className="text-xl">
                                 {feature.title}
                              </CardTitle>
                           </motion.div>
                        </CardHeader>
                        <CardContent className="text-center">
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                           >
                              <CardDescription className="text-pretty">
                                 {feature.description}
                              </CardDescription>
                           </motion.div>
                        </CardContent>
                     </Card>
                  </motion.div>
               ))}
            </motion.div>
         </div>
      </section>
   );
};
