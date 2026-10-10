import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["contact", "quote"]),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,18}$/, "Enter a phone number with 10 to 18 digits."),
  whatsapp: z.string().trim().max(18).optional().default(""),
  serviceSlug: z.string().trim().min(2).max(80),
  citySlug: z.string().trim().min(2).max(80),
  areaSlug: z.string().trim().max(80).optional().default(""),
  propertyType: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required." }) }),
  companyWebsite: z.string().optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
