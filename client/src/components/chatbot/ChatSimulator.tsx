import { Section } from "@/types/types";
import { RefObject } from "react";

interface ChatSimulatorProps {
  messages: any[];
  primaryColour: string;
  sections: Section[];
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSectionClick: (name: string) => void;
  activeSection: string | null;
  istyping: boolean;
  handleReset: () => void;
  scrollRef: RefObject<HTMLDivElement | null>
}

const ChatSimulator = ({
  messages,
  primaryColour,
  sections,
  input,
  setInput,
  handleSend,
  handleKeyDown,
  handleSectionClick,
  activeSection,
}: ChatSimulatorProps) => {
  return (
    <div>
      Hello World
    </div>
  )
};

export default ChatSimulator;
