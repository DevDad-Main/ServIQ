import AddKnowledgeModal from "@/components/knowledge/AddKnowledgeModal";
import QuickActions from "@/components/knowledge/QuickActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useKnowledge } from "@/hooks/useApi";
import { useToast } from "@/lib/toast";

const KnowledgePage = () => {
  const [defaultTab, setDefaultTab] = useState("website");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { sources, loading, storeKnowledge } = useKnowledge();
  const { success, error } = useToast();

  const openModal = (tab: string) => {
    setDefaultTab(tab);
    setIsAddOpen(true);
  };

  const handleImportSource = async (data: any) => {
    try {
      await storeKnowledge(data);
      success("Knowledge source added successfully");

      if (data.type === "upload") {
        setIsAddOpen(false);
      }
    } catch (err) {
      error("Failed to add knowledge source");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Knowledge Base
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your website sources, documents, and uploads here.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => openModal("website")}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onOpenModal={openModal} />

      {/* Knowledge Model */}
      <AddKnowledgeModal
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        defaultTab={defaultTab}
        setDefaultTab={setDefaultTab}
        onImport={handleImportSource}
        isLoading={loading}
        existingSources={sources}
      />
    </div>
  );
};

export default KnowledgePage;
