import { KnowledgeSource } from "@/types/types";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  getStatusBadge,
  getTypeIcon,
  SourceStatus,
  SourceType,
} from "./KnowledgeTable";
import { Button } from "../ui/button";

interface SourceDetailsSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSource: KnowledgeSource | null;
}

const SourceDetailsSheet = ({
  isOpen,
  setIsOpen,
  selectedSource,
}: SourceDetailsSheetProps) => {
  if (!selectedSource) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md border-l border-white/10 bg-[#0a0a0e] p-0 shadow-2xl">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-white/5">
            {/* Display source Type and Name */}
            <SheetTitle className="text-xl text-white flex items-center gap-2">
              {getTypeIcon(selectedSource.type as SourceType)}
              {selectedSource.name}
            </SheetTitle>

            {/* Display the URL */}
            <SheetDescription className="text-zinc-500">
              {selectedSource.sourceUrl || "Manual Entry."}
            </SheetDescription>

            {/* Display the updated at time and status icon*/}
            <div className="pt-2 flex gap-2">
              {getStatusBadge(selectedSource.status as SourceStatus)}
              <span className="text-xs text-zinc-500 py-1 flex items-center">
                Updated{" "}
                {selectedSource.updatedAt &&
                  new Date(selectedSource.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </SheetHeader>

          {/* Display the content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
                Content Preview
              </h4>
              <div className="p-4 rounded-lg border border-white/5 bg-black/40 font-mono text-xs text-zinc-400 h-72 overflow-y-auto leading-relaxed">
                {selectedSource.content ||
                  `# ${selectedSource.name}\n\n(No content preview available)`}
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 border-t border-white/5 bg-[#050509]">
            <Button
              variant="destructive"
              className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              Disconnect Source
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SourceDetailsSheet;
