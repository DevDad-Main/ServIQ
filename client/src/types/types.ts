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

export interface User {
  email: string;
  organization_id: string;
}

export interface Metadata {
  business_name: string;
  website_url: string;
  external_links?: string;
}

export type SectionStatus = "active" | "draft" | "disabled";
export type Tone = "strict" | "neutral" | "friendly" | "empathetic";

export interface FormData {
  name: string;
  description: string;
  tone: Tone;
  allowedTopics: string;
  blockedTopics: string;
  fallbackBehaviour: string;
}
