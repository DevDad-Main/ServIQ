import Joi from "joi";
import { z } from "zod";

export interface BusinessInfoData {
  businessName: string;
  websiteURL: string;
  externalLinks: string;
}

export interface WebsiteSourceData {
  url: string;
}

export interface TextSourceData {
  title: string;
  content: string;
}

export interface UploadSourceData {
  file: File;
}

export const businessInfoSchema = Joi.object({
  businessName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Business name is required",
      "string.min": "Business name must be at least 1 character",
      "string.max": "Business name must be less than 100 characters",
      "any.required": "Business name is required",
    }),
  websiteURL: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .required()
    .messages({
      "string.empty": "Website URL is required",
      "string.uri": "Please enter a valid URL (e.g., https://example.com)",
      "any.required": "Website URL is required",
    }),
  externalLinks: Joi.string()
    .trim()
    .allow("")
    .optional()
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      if (!value.trim()) return "";
      const urls = value.split(",").map((url) => url.trim());
      
      for (const url of urls) {
        if (url && !Joi.string().uri({ scheme: ["http", "https"] }).validate(url).error) {
          continue;
        }
        return helpers.error("custom.invalidUrls");
      }
      
      return value;
    })
    .messages({
      "custom.invalidUrls": "One or more external links are invalid",
    }),
});

export const websiteSourceSchema = Joi.object({
  url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .required()
    .messages({
      "string.empty": "Website URL is required",
      "string.uri": "Please enter a valid URL (e.g., https://www.google.co.uk)",
      "any.required": "Website URL is required",
    }),
});

export const textSourceSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 1 character",
      "string.max": "Title must be less than 200 characters",
      "any.required": "Title is required",
    }),
  content: Joi.string()
    .trim()
    .min(1)
    .max(50000)
    .required()
    .messages({
      "string.empty": "Content is required",
      "string.min": "Content must be at least 1 character",
      "string.max": "Content must be less than 50,000 characters",
      "any.required": "Content is required",
    }),
});

const fileSchema = Joi.object({
  size: Joi.number().max(10 * 1024 * 1024).messages({
    "number.max": "File size must be less than 10MB",
  }),
  name: Joi.string()
    .pattern(/\.csv$/i)
    .messages({
      "string.pattern.base": "Only CSV files are allowed",
    }),
  type: Joi.string().valid("text/csv").messages({
    "any.only": "Only CSV files are allowed",
  }),
}).unknown(true);

export const uploadSourceSchema = Joi.object({
  file: fileSchema.required().messages({
    "any.required": "Please select a file to upload",
  }),
});

export const validateBusinessInfo = (data: unknown): { valid: boolean; error?: string; value?: BusinessInfoData } => {
  const result = businessInfoSchema.validate(data, { abortEarly: true });
  
  if (result.error) {
    return {
      valid: false,
      error: result.error.details[0].message,
    };
  }
  
  return {
    valid: true,
    value: result.value as BusinessInfoData,
  };
};

export const validateWebsiteSource = (data: unknown): { valid: boolean; error?: string; value?: WebsiteSourceData } => {
  const result = websiteSourceSchema.validate(data, { abortEarly: true });
  
  if (result.error) {
    return {
      valid: false,
      error: result.error.details[0].message,
    };
  }
  
  return {
    valid: true,
    value: result.value as WebsiteSourceData,
  };
};

export const validateTextSource = (data: unknown): { valid: boolean; error?: string; value?: TextSourceData } => {
  const result = textSourceSchema.validate(data, { abortEarly: true });
  
  if (result.error) {
    return {
      valid: false,
      error: result.error.details[0].message,
    };
  }
  
  return {
    valid: true,
    value: result.value as TextSourceData,
  };
};

export const validateUploadSource = (data: unknown): { valid: boolean; error?: string; value?: UploadSourceData } => {
  const result = uploadSourceSchema.validate(data, { abortEarly: true });
  
  if (result.error) {
    return {
      valid: false,
      error: result.error.details[0].message,
    };
  }
  
  return {
    valid: true,
    value: result.value as UploadSourceData,
  };
};

export interface SectionData {
  name: string;
  description: string;
  sourceIds: string[];
  tone: "strict" | "neutral" | "friendly" | "empathetic";
  allowedTopics: string[];
  blockedTopics: string[];
}

export const sectionSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Section name is required",
      "string.min": "Section name must be at least 1 character",
      "string.max": "Section name must be less than 100 characters",
      "any.required": "Section name is required",
    }),
  description: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 1 character",
      "string.max": "Description must be less than 500 characters",
      "any.required": "Description is required",
    }),
  sourceIds: Joi.array()
    .items(Joi.string().uuid())
    .min(0)
    .required()
    .messages({
      "array.base": "Source IDs must be an array",
      "string.guid": "Invalid source ID format",
    }),
  tone: Joi.string()
    .valid("strict", "neutral", "friendly", "empathetic")
    .required()
    .messages({
      "any.only": "Tone must be one of: strict, neutral, friendly, empathetic",
      "any.required": "Tone is required",
    }),
  allowedTopics: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .min(0)
    .required()
    .messages({
      "array.base": "Allowed topics must be an array",
      "string.min": "Topic cannot be empty",
      "string.max": "Topic must be less than 50 characters",
    }),
  blockedTopics: Joi.array()
    .items(Joi.string().trim().min(1).max(50))
    .min(0)
    .required()
    .messages({
      "array.base": "Blocked topics must be an array",
      "string.min": "Topic cannot be empty",
      "string.max": "Topic must be less than 50 characters",
    }),
});

export const sectionZodSchema = z.object({
  name: z.string().trim().min(1).max(100, {
    message: "Section name must be less than 100 characters",
  }),
  description: z.string().trim().min(1).max(500, {
    message: "Description must be less than 500 characters",
  }),
  sourceIds: z.array(z.string().uuid()).min(0),
  tone: z.enum(["strict", "neutral", "friendly", "empathetic"], {
    errorMap: () => ({ message: "Tone must be one of: strict, neutral, friendly, empathetic" }),
  }),
  allowedTopics: z.array(z.string().trim().min(1).max(50)).min(0),
  blockedTopics: z.array(z.string().trim().min(1).max(50)).min(0),
});

export const validateSection = (data: unknown): { valid: boolean; error?: string; value?: SectionData } => {
  const result = sectionSchema.validate(data, { abortEarly: true });
  
  if (result.error) {
    return {
      valid: false,
      error: result.error.details[0].message,
    };
  }
  
  return {
    valid: true,
    value: result.value as SectionData,
  };
};

export const validateSectionWithZod = (data: unknown): { valid: boolean; error?: string; value?: SectionData } => {
  const result = sectionZodSchema.safeParse(data);
  
  if (!result.success) {
    return {
      valid: false,
      error: result.error.errors[0]?.message || "Invalid section data",
    };
  }
  
  return {
    valid: true,
    value: result.data,
  };
};
