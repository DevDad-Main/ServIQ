import Joi from "joi";

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
