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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user" as const, text: input },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot/chat", {
        message: input,
        history: messages.slice(-5), // Only last 5 messages
      });

      const botReply =
        res.data?.message?.reply || "Sorry, I didn’t understand that.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot" as const, text: botReply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot" as const,
          text: "Oops! Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderTypingDots = () => (
    <motion.div
      className="flex items-center space-x-1 bg-muted text-muted-foreground px-4 py-2 rounded-lg text-sm self-start mr-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-100">.</span>
      <span className="animate-bounce delay-200">.</span>
    </motion.div>
  );

  return (
    <>
      {/* Floating Button with hover animation */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="rounded-full p-4 h-14 w-14 shadow-lg"
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
            className="fixed bottom-20 right-6 z-50 w-[90vw] max-w-sm bg-background border shadow-xl rounded-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted">
              <div className="font-semibold text-primary">SerenityBot 💬</div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setMessages([])}
                    className="text-red-500"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto max-h-96 p-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && <div className="text-xl">🤖</div>}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-line max-w-[75%] ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-muted-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && <div className="text-xl">👤</div>}
                </div>
              ))}

              {/* Typing */}
              <AnimatePresence>
                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="text-xl">🤖</div>
                    {renderTypingDots()}
                  </div>
                )}
              </AnimatePresence>

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
              <Button onClick={handleSend} disabled={!input.trim() || loading}>
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
