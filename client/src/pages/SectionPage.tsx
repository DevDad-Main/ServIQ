import SectionFormFields from "@/components/sections/SectionFormFields";
import SectionsTable from "@/components/sections/SectionsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useKnowledge, useSections } from "@/hooks/useApi";
import { toast } from "@/lib/toast";
import { validateSectionWithZod } from "@/lib/validation";
import { FormData, Section, SectionStatus, Tone } from "@/types/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface SectionPageInterface {
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

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehaviour: "escalate",
};

const SectionPage = () => {
  const {
    sources: knowledgeSources,
    loading: isLoadingSources,
    fetchSources,
  } = useKnowledge();

  const {
    sections,
    loading: isLoadingSections,
    error: sectionsError,
    createSection,
    updateSection,
    deleteSection,
  } = useSections();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] =
    useState<SectionPageInterface | null>(null);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleCreateSection = async () => {
    setSelectedSection({
      id: "new",
      name: "",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  const handleSaveSection = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const allowedTopicsArray = formData.allowedTopics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);

      const blockedTopicsArray = formData.blockedTopics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);

      const sectionData = {
        name: formData.name,
        description: formData.description,
        sourceIds: selectedSources,
        tone: formData.tone,
        allowedTopics: allowedTopicsArray,
        blockedTopics: blockedTopicsArray,
      };

      const validation = validateSectionWithZod(sectionData);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid section data");
        return;
      }

      await createSection(validation.value);
      toast.success("Section created successfully");
      setIsSheetOpen(false);
      setSelectedSection(null);
      setFormData(INITIAL_FORM_DATA);
      setSelectedSources([]);
    } catch (error) {
      console.error("Failed to create section:", error);
      toast.error("Failed to create section");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewSection = async (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      tone: section.tone,
      allowedTopics: section.allowedTopics || "",
      blockedTopics: section.blockedTopics || "",
      fallbackBehaviour: "escalate",
    });
    setSelectedSources(section.sourceIds || []);
    setIsSheetOpen(true);
  };

  const handleDeleteSection = async () => {
    if (!selectedSection || selectedSection.id === "new" || isSaving) return;

    setIsSaving(true);

    try {
      await deleteSection(selectedSection.id);
      toast.success("Section deleted successfully");
      setIsSheetOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error("Failed to delete section:", error);
      toast.error("Failed to delete section");
    } finally {
      setIsSaving(false);
    }
  };

  const isPreviewMode = selectedSection?.id !== "new";

  console.log("SECTIONS DATA", sections);

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
      // {/* Card Sections */}
      //{" "}
      {/* }<Card className="border-white/5 bg-[#0a0a0e]">
      //   <CardContent className="p-6">
      //     {isLoadingSections ? (
      //       <div className="text-center text-zinc-400">Loading sections...</div>
      //     ) : sections.length === 0 ? (
      //       <div className="text-center text-zinc-400">
      //         No sections created yet. Create your first section to get started.
      //       </div>
      //     ) : (
      //       <div className="grid gap-4">
      //         {console.log("SECTIONS", sections)}
      //         {sections.data.map((section) => (
      //           <div
      //             key={section.id}
      //             className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
      //             onClick={() => {
      //               setSelectedSection(section);
      //               setSelectedSources(section.sourceIds);
      //               setFormData({
      //                 name: section.name,
      //                 description: section.description,
      //                 tone: section.tone,
      //                 allowedTopics: section.allowedTopics.join(", "),
      //                 blockedTopics: section.blockedTopics.join(", "),
      //                 fallbackBehaviour: "escalate",
      //               });
      //               setIsSheetOpen(true);
      //             }}
      //           >
      //             <div className="flex items-center justify-between">
      //               <div>
      //                 <h3 className="text-white font-medium">{section.name}</h3>
      //                 <p className="text-zinc-400 text-sm mt-1">
      //                   {section.description}
      //                 </p>
      //                 <div className="flex items-center gap-4 mt-2">
      //                   <span className="text-xs text-zinc-500">
      //                     Tone:{" "}
      //                     <span className="text-zinc-400">{section.tone}</span>
      //                   </span>
      //                   <span className="text-xs text-zinc-500">
      //                     Sources:{" "}
      //                     <span className="text-zinc-400">
      //                       {section.sourceIds.length}
      //                     </span>
      //                   </span>
      //                   <span
      //                     className={`text-xs px-2 py-1 rounded-full ${
      //                       section.status === "active"
      //                         ? "bg-green-500/10 text-green-400 border border-green-500/20"
      //                         : section.status === "draft"
      //                           ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
      //                           : "bg-red-500/10 text-red-400 border border-red-500/20"
      //                     }`}
      //                   >
      //                     {section.status}
      //                   </span>
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         ))}
      //       </div>
      //     )}
      //   </CardContent>
      // </Card>


      {/* Card Sections */}
      <Card className="border-white/5 bg-[#0a0a0e]">
        <CardContent className="p-6">
          <SectionsTable
            sections={sections}
            isLoading={isLoadingSections}
            onPreview={handlePreviewSection}
            onCreateSelection={handleCreateSection}
          />
        </CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg border-l border-white/10 bg-[#0a0a0e] p-0 shadow-2xl flex flex-col h-full">
          {selectedSection && (
            <>
              <SheetHeader
                className="
                p-6 border-b border-white/5"
              >
                <SheetTitle className="text-xl text-white">
                  {selectedSection.id === "new"
                    ? "Create Section"
                    : "View Section"}
                </SheetTitle>
                <SheetDescription className="text-zinc-500">
                  {selectedSection.id === "new"
                    ? "Configure how the AI behaves for this specific topic"
                    : "Review section configuration and data sources"}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                <SectionFormFields
                  formData={formData}
                  setFormData={setFormData}
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  knowledgeSources={knowledgeSources}
                  isLoadingSources={isLoadingSources}
                  isDisabled={isPreviewMode}
                />
              </div>

              {selectedSection.id === "new" && (
                <div className="p-6 border-t border-white/5">
                  <Button
                    className="w-full bg-white text-black hover:bg-zinc-200"
                    onClick={handleSaveSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Creating..." : "Create Section"}
                  </Button>
                </div>
              )}

              {selectedSection.id !== "new" && (
                <div className="p-6 bg-red-500/5 border-t border-red-500/10 ">
                  <h5 className="text-sm font-medium text-red-400 mb-1">
                    Danger Zone
                  </h5>
                  <p className="text-xs text-red-500/70 mb-3">
                    Deleting this section will remove all associated rules.
                  </p>
                  <Button
                    className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 shadow-none"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Deleting..." : "Delete Section"}
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionPage;
