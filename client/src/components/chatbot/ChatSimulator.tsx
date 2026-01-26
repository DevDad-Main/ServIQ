import { Section } from "@/types/types";
import { RefObject } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Bot, RefreshCw, Send, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import { Textarea } from "../ui/textarea";

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
  isTyping: boolean;
  handleReset: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const ChatSimulator = ({
  messages,
  primaryColour,
  sections,
  input,
  setInput,
  handleSend,
  handleReset,
  handleKeyDown,
  handleSectionClick,
  activeSection,
  isTyping,
  scrollRef,
}: ChatSimulatorProps) => {
  return (
    <Card className="flex-1 flex flex-col border-white/5 bg-[#0a0a0e] overflow-hidden relative shadow-2xl">
      <div className="border-b h-14 border-white/5 flex items-center justify-between px-6 bg-[#0e0e12]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-300">
            Test Environment
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-zinc-500 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="relative flex-1 p-6 bg-zinc-950/30">
        <div className="pb-4 space-y-6">
          {messages.map((msg, i) => (
            <div
              className={cn(
                "flex w-full flex-col ",
                msg.role === "user" ? "items-center" : "items-start",
              )}
              key={i}
            >
              <div
                className={cn(
                  "flex max-w-[80%] gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5",
                    msg.role === "user" ? "bg-zinc-800" : "text-white",
                  )}
                  style={
                    msg.role !== "user"
                      ? { backgroundColor: primaryColour }
                      : {}
                  }
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-zinc-800 text-zinc-200 rounded-tr-sm"
                        : "bg-white text-zinc-900 rounded-tl-sm",
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.isWelcome && sections.length > 0 && (
                    <div className="flex flex-wrap pt-1 ml-1 gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      {sections.map((section) => (
                        <button
                          className="px-3 py-1.5 rounded-full border"
                          key={section.id}
                          onClick={() => handleSectionClick(section.name)}
                        >
                          {section.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start w-full">
              <div className="flex max-w-[80%] gap-3 flex-row">
                <div
                  className="flex items-center justify-center w-8 h-8 border rounded-full shrink-0 border-white/5"
                  style={{ backgroundColor: primaryColour }}
                >
                  <Bot className="w-4 h-5 text-white" />
                </div>
                <div className="flex items-center p-4 bg-white rounded-tl-sm rounded-2xl text-zinc-900 shadow-sm gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area*/}
      <div className="p-4 bg-[#0a0a0e] border-t border-white/5">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!activeSection}
            placeholder={
              activeSection
                ? "Type a message..."
                : "Please select a category above to start..."
            }
            className="min-h-[50px] max-h-[150px] pr-12 outline-none text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Button
            className={cn(
              "absolute w-8 h-8 right-2 bottom-2 transition-colors",
              !activeSection || !input.trim()
                ? "bg-zinc-800 text-zinc-500"
                : "",
            )}
            size="icon"
            onClick={handleSend}
            disabled={!activeSection || !input.trim()}
            style={
              activeSection && input.trim()
                ? { backgroundColor: primaryColour, color: "white" }
                : {}
            }
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatSimulator;
