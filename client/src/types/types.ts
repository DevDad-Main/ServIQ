export type KnowledgeType = "upload" | "website" | "text";
export type KnowledgeStatus = "active" | "processing" | "error";

export interface KnowledgeSource {
  id: string;
  userEmail: string;
  type: KnowledgeType;
  name: string;
  sourceUrl?: string;
  content: string;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
}
