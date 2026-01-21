import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const SectionPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleCreateSection = () => {};

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
