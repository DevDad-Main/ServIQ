import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import React, { useState } from "react";

type SectionStatus = "active" | "draft" | "disabled";
type Tone = "strict" | "neutral" | "friendly" | "empathetic";

interface Section {
  id: string;
  name: string;
  description: string;
  sourceCount: number;
  source_ids?: string[];
  tone: Tone;
  scopeLabel: string;
  allowed_topics?: string;
  blocked_topics?: string;
  status: SectionStatus;
}

interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface FormData {
  name: string;
  description: string;
  tone: Tone;
  allowedTopics: string;
  blockedTopics: string;
  fallbackBehaviour: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehaviour: "escalate",
};

const SectionPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    [],
  );
  const [selectedSources, setSelectedSource] = useState<string[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleCreateSection = async () => {};

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sections</h1>
          <p className=" text-zinc-400 mt-1">
            Define behaviour and the tone for different topics
          </p>
        </div>

        <Button
          onClick={handleCreateSection}
          className="bg-white text-black hover:bg-zinc-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Section
        </Button>
      </div>

      {/* Card Sections */}
      <Card className="border-white/5 bg-[#0a0a0e]">
        <CardContent className="p-0">Temporarily Empty</CardContent>
      </Card>

      <Sheet open={isSheetOpen}></Sheet>
    </div>
  );
};

export default SectionPage;
