import ChatSimulator from "@/components/chatbot/ChatSimulator";
import React, { useEffect, useRef, useState } from "react";
import { Section } from "../types/types";
import { useChatbot, useSections } from "@/hooks/useApi";

interface ChatbotMetadata {
  id: string;
  userEmail: string;
  colour: string;
  welcomeMessage: string;
  createdAt: string;
  sourceIds: string[];
}

const ChatbotPage = () => {
  const { metadata, loading: metadataLoading } = useChatbot();
  const { sections, loading: sectionsLoading } = useSections();
  const loading = metadataLoading || sectionsLoading;

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    console.log("Metadata changed:", metadata);
    console.log("Current messages:", messages);
    console.log("Should add welcome message:", metadata?.welcomeMessage && messages.length === 0);
    
    if (metadata?.welcomeMessage && messages.length === 0) {
      const welcomeMsg = {
        id: 'welcome',
        role: 'assistant',
        content: metadata.welcomeMessage,
        timestamp: new Date().toISOString(),
        isWelcome: true
      };
      console.log("Adding welcome message:", welcomeMsg);
      setMessages([welcomeMsg]);
    }
  }, [metadata, messages.length]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const [primaryColour, setPrimaryColour] = useState(metadata?.colour || "#4f46e5");
  const [welcomeMessage, setWelcomeMessage] = useState(metadata?.welcomeMessage || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (metadata) {
      setPrimaryColour(metadata.colour);
      setWelcomeMessage(metadata.welcomeMessage);
    }
  }, [metadata]);

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
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col w-full">
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

      <div className="flex-1 min-h-0">
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
  );
};

export default ChatbotPage;
