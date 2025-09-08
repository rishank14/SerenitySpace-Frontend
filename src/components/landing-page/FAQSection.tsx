"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
   Accordion,
   AccordionItem,
   AccordionTrigger,
   AccordionContent,
} from "@/components/ui/accordion";

interface FAQ {
   question: string;
   answer: string;
   value: string;
}

const faqs: FAQ[] = [
   {
      value: "privacy",
      question: "Is my data private and secure?",
      answer:
         "Absolutely. All your data is private and encrypted. Anonymous venting is completely untraceable, and private reflections are accessible only to you. We never share your personal information with anyone and follow strict privacy protocols.",
   },
   {
      value: "free",
      question: "Is SerenitySpace completely free?",
      answer:
         "Yes! SerenitySpace is fully free to use. You get access to the Vent Room, Reflection Space, Message Vault, and SerenityBot support without any cost. We built it to make mental wellness accessible to everyone.",
   },
   {
      value: "delivery",
      question: "How does message delivery work in the Message Vault?",
      answer:
         "You can schedule messages to be delivered to yourself at any future date and time. Messages are stored securely and delivered via in-app popups. You can even set recurring messages for daily reminders or weekly reflections.",
   },
   {
      value: "ai",
      question: "How helpful is SerenityBot?",
      answer:
         "SerenityBot is an AI companion trained for emotional support and mental wellness conversations. It offers empathetic responses, coping strategies, and emotional validation anytime you need. It's here to support you, but not to replace professional help.",
   },
   {
      value: "professional",
      question: "Can SerenitySpace replace professional therapy?",
      answer:
         "No. SerenitySpace is meant to complement professional mental health care. While it can provide emotional support and self-reflection opportunities, always consult licensed mental health professionals for serious or ongoing concerns.",
   },
];

export const FAQSection: React.FC = () => {
   const container = {
      hidden: {},
      show: { transition: { staggerChildren: 0.15 } },
   };

   const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 },
   };

   return (
      <section id="faq" className="py-20 px-5 md:py-32 bg-muted/30">
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
                  Frequently asked questions
               </motion.h2>
               <motion.p
                  className="mt-4 text-lg text-muted-foreground text-pretty"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
               >
                  Everything you need to know about SerenitySpace and your
                  privacy.
               </motion.p>
            </motion.div>

            {/* Accordion */}
            <motion.div
               className="mx-auto max-w-3xl"
               initial="hidden"
               whileInView="show"
               viewport={{ once: true, amount: 0.3 }}
               variants={container}
            >
               <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                     <motion.div
                        key={faq.value}
                        variants={fadeUp}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                        className="mb-2"
                     >
                        <AccordionItem
                           value={faq.value}
                           className="rounded-lg border border-border/30"
                        >
                           <AccordionTrigger className="text-left font-medium">
                              {faq.question}
                           </AccordionTrigger>
                           <AccordionContent className="text-muted-foreground text-pretty mt-1">
                              {faq.answer}
                           </AccordionContent>
                        </AccordionItem>
                     </motion.div>
                  ))}
               </Accordion>
            </motion.div>
         </div>
      </section>
   );
};
