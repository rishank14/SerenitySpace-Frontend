import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ChatbotWidget />
    </>
  );
}
