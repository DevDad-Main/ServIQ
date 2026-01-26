import ChatSimulator from "@/components/chatbot/ChatSimulator";
import React, { useEffect, useRef, useState } from "react";
import { Section } from "../types/types";

interface ChatbotMetadata {
  id: string;
  userEmail: string;
  colour: string;
  welcomeMessage: string;
  createdAt: string;
  sourceIds: string[];
}

const ChatbotPage = () => {
  const [metadata, setMetadata] = useState<ChatbotMetadata | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const [primaryColour, setPrimaryColour] = useState("#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {};
  const handleKeyDown = async () => {};
  const handleSectionClick = async () => {};
  const handleReset = async () => {};

  return (
    <div className="p-6 mx-auto md:p-8 space-y-8 max-w-[400px] animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Chatbot Playground
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Test your assistant, customize appearance, and deploy...
          </p>
        </div>
      </div>

      <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="flex flex-col h-full min-h-0 lg:col-span-7 space-y-4">
          <ChatSimulator
            messages={messages}
            primaryColour={primaryColour}
            sections={sections}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleKeyDown={handleKeyDown}
            handleSectionClick={handleSectionClick}
            activeSection={activeSection}
            isTyping={isTyping}
            handleReset={handleReset}
            scrollRef={scrollViewportRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
