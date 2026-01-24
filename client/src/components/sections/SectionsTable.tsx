import { Section } from "@/types/types";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../ui/table";
import { getStatusBadge, getToneBadge } from "./sectionBadges";
import { Button } from "../ui/button";

interface SectionTableProps {
  sections: Section[];
  isLoading: boolean;
  onPreview: (section: Section) => void;
  onCreateSection: () => void;
}

const SectionsTable = ({
  sections,
  isLoading,
  onPreview,
  onCreateSection,
}: SectionTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="text-xs uppercase font-medium text-zinc-500">
            Name
          </TableHead>
          <TableHead className="text-xs uppercase font-medium text-zinc-500">
            Sources
          </TableHead>
          <TableHead className="text-xs uppercase font-medium text-zinc-500">
            Tone
          </TableHead>
          <TableHead className="text-xs uppercase font-medium text-zinc-500">
            Scope
          </TableHead>
          <TableHead className="text-xs uppercase font-medium text-zinc-500">
            Status
          </TableHead>
          <TableHead className="text-xs uppercase font-medium text-zinc-500 text-right">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex items-center justify-center gap-2 text">
                <div className="w-4 h-4 border-2 border-zinc-600 border-t" />
                <span>Loading Sections...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : sections?.length > 0 ? (
          sections.map((section) => (
            <TableRow
              key={section.id}
              className="border-white/5 group transition-colors"
            >
              <TableCell className="font-medium text-zinc-200">
                {section.name}
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {section.sourceIds.length}
                <span className="text-zinc-600">
                  {" "}
                  {section.sourceIds.length === 1 ? "source" : "sources"}
                </span>
              </TableCell>
              <TableCell>{getToneBadge(section.tone)}</TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {section.scopeLabel || "General"}
              </TableCell>
              <TableCell>{getStatusBadge(section.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-zinc-400 hover:text-white hover:bg-white/5"
                  onClick={() => onPreview(section)}
                >
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <>
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center"></TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default SectionsTable;
