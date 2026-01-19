export type KnowledgeType = "upload" | "website" | "text";

export interface CreateKnowledgeInput {
  type: KnowledgeType;
  userEmail: string;
  url?: string;
  title?: string;
  content?: string;
  csvData?: Record<string, unknown>[];
}

export interface KnowledgeSource {
  id: string;
  userEmail: string;
  type: KnowledgeType;
  name: string;
  sourceUrl?: string;
  content: string;
  status: "active" | "processing" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedCSVResult {
  rows: Record<string, unknown>[];
  totalRows: number;
  firstTen: Record<string, unknown>[];
}

export interface ScrapeResult {
  markdown: string;
  url: string;
  success: boolean;
}
