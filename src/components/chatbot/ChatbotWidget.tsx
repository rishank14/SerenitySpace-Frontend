"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X, MoreVertical, Trash2 } from "lucide-react";
import API from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Message = {
   sender: "user" | "bot";
   text: string;
};

export default function ChatbotWidget() {
   const initialBotMessage = "Hi! I’m SerenityBot, here to help you.";

   const [isOpen, setIsOpen] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState("");
   const [loading, setLoading] = useState(false);
   const [showInitialMessage, setShowInitialMessage] = useState(false);
   const [initialTypingDone, setInitialTypingDone] = useState(false);

   const messagesEndRef = useRef<HTMLDivElement | null>(null);

   const scrollToBottom = () => {
      setTimeout(() => {
         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages, loading, showInitialMessage, initialTypingDone]);

   const toggleChat = () => {
      setIsOpen(!isOpen);
      if (!isOpen) {
         setShowInitialMessage(true);
         setInitialTypingDone(false);
      }
   };

   const handleSend = async () => {
      if (!input.trim()) return;

      const userMessage: Message = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
         const res = await API.post("/chatbot/chat", {
            message: input,
            history: messages.slice(-5),
         });

         const botReply: string =
            res.data?.message?.reply || "Sorry, I didn’t understand that.";

         // Add bot message **after typing animation finishes**
         setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
            setLoading(false);
         }, 1000); // simulate typing delay
      } catch {
         setTimeout(() => {
            setMessages((prev) => [
               ...prev,
               {
                  sender: "bot",
                  text: "Oops! Something went wrong. Try again later.",
               },
            ]);
            setLoading(false);
         }, 1000);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   const renderTypingDots = () => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
         <span className="animate-bounce">.</span>
         <span className="animate-bounce delay-100">.</span>
         <span className="animate-bounce delay-200">.</span>
      </div>
   );

   const clearChat = () => {
      setMessages([]);
      setShowInitialMessage(true);
      setInitialTypingDone(false);
      setLoading(false);
   };

   // Initial bot message typing
   useEffect(() => {
      if (showInitialMessage && !initialTypingDone) {
         setLoading(true);
         const timer = setTimeout(() => {
            setLoading(false);
            setInitialTypingDone(true);
         }, 1200);
         return () => clearTimeout(timer);
      }
   }, [showInitialMessage, initialTypingDone]);

   return (
      <>
         {/* Floating Button */}
         <motion.div
            className="fixed bottom-6 right-6 z-50"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
         >
            <Button
               className="rounded-full p-4 h-16 w-16 shadow-xl"
               onClick={toggleChat}
               variant="default"
            >
               {isOpen ? <X size={36} /> : <Bot size={36} />}
            </Button>
         </motion.div>

         {/* Chatbox */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed bottom-20 right-6 z-50 w-[90vw] max-w-sm bg-background border shadow-2xl rounded-xl flex flex-col overflow-hidden"
               >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b bg-muted">
                     <div className="font-semibold text-primary">
                        SerenityBot 💬
                     </div>

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon">
                              <MoreVertical size={18} />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={clearChat}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                           >
                              <Trash2 size={14} className="mr-2" /> Clear Chat
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto max-h-96 p-3 space-y-3">
                     {/* Initial Bot Message */}
                     <AnimatePresence>
                        {showInitialMessage && (
                           <motion.div
                              className="flex items-start gap-2 justify-start"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                           >
                              <div className="text-xl">🤖</div>
                              {!initialTypingDone && renderTypingDots()}
                              {initialTypingDone && (
                                 <div className="px-4 py-2 rounded-2xl text-sm whitespace-pre-line max-w-[75%] bg-muted text-muted-foreground rounded-bl-none shadow-sm">
                                    {initialBotMessage}
                                 </div>
                              )}
                           </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Dynamic Messages */}
                     {messages.map((msg, i) => (
                        <div
                           key={i}
                           className={`flex items-start gap-2 ${
                              msg.sender === "user"
                                 ? "justify-end"
                                 : "justify-start"
                           }`}
                        >
                           {msg.sender === "bot" && (
                              <div className="text-xl flex items-center gap-2">
                                 🤖
                                 {/* Only show typing dots **before bot message appears** */}
                                 {loading &&
                                    i === messages.length - 1 &&
                                    renderTypingDots()}
                              </div>
                           )}
                           <div
                              className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line max-w-[75%] ${
                                 msg.sender === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-none shadow-md"
                                    : "bg-muted text-muted-foreground rounded-bl-none shadow-sm"
                              }`}
                           >
                              {msg.text}
                           </div>
                           {msg.sender === "user" && (
                              <div className="text-xl">👤</div>
                           )}
                        </div>
                     ))}

                     {/* Future bot message slot while typing */}
                     {loading && initialTypingDone && (
                        <div className="flex items-start gap-2 justify-start">
                           <div className="text-xl">🤖</div>
                           {renderTypingDots()}
                        </div>
                     )}

                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t flex items-center gap-2">
                     <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                     />
                     <Button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                     >
                        <Send size={16} className="mr-1" />
                        Send
                     </Button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}
