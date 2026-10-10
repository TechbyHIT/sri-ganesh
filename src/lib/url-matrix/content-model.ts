import { z } from "zod";
import { hasPlaceholder } from "@/lib/content/placeholders";

/**
 * Content a business must supply before a matrix URL can leave review.
 * Every field is real information: coverage the business confirmed, documented work, verified facts.
 * Nothing here is filled in by swapping a place name into shared text.
 */
export const matrixContentSchema = z.object({
  introduction: z.string().trim().min(120),
  verifiedCoverage: z.string().trim().min(40),
  propertyTypes: z.array(z.string().trim().min(3)).min(1),
  applications: z.array(z.string().trim().min(10)).min(2),
  installationDetails: z.string().trim().min(120),
  materials: z.array(z.string().trim().min(3)).default([]),
  /** Only work the business has documented. Leave empty when there is none. */
  projects: z
    .array(
      z.object({
        title: z.string().trim().min(5),
        detail: z.string().trim().min(40),
        documented: z.literal(true),
      }),
    )
    .default([]),
  maintenance: z.string().trim().min(60),
  faqs: z.array(z.object({ question: z.string().trim().min(10), answer: z.string().trim().min(40) })).min(2),
  relatedServicePaths: z.array(z.string().startsWith("/")).default([]),
  /** Slugs of nearby locations that also have confirmed coverage. */
  nearbyLocationSlugs: z.array(z.string()).default([]),
  source: z.object({
    note: z.string().trim().min(10),
    verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    verifiedBy: z.string().trim().min(2),
  }),
});

export type MatrixContent = z.infer<typeof matrixContentSchema>;

export type MatrixApproval = {
  /** Canonical matrix path, no trailing slash. */
  path: string;
  /** Business confirmation that this service is offered at this place. */
  coverage: { confirmedBy: string; confirmedOn: string };
  /** Meta title and description written for this page. */
  title: string;
  description: string;
  content: MatrixContent;
};

export type ApprovalCheck = { ok: boolean; reasons: string[] };

export function checkApproval(approval: MatrixApproval): ApprovalCheck {
  const reasons: string[] = [];
  const parsed = matrixContentSchema.safeParse(approval.content);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      reasons.push(`content.${issue.path.join(".")}: ${issue.message}`);
    }
  }

  if (!approval.coverage.confirmedBy.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(approval.coverage.confirmedOn)) {
    reasons.push("coverage confirmation is missing");
  }

  if (approval.title.trim().length < 20 || approval.title.length > 70) {
    reasons.push("title must be 20 to 70 characters");
  }

  if (approval.description.trim().length < 70 || approval.description.length > 160) {
    reasons.push("description must be 70 to 160 characters");
  }

  const text = [approval.title, approval.description, JSON.stringify(approval.content)].join(" ");

  if (hasPlaceholder(text)) {
    reasons.push("placeholder text found");
  }

  return { ok: reasons.length === 0, reasons };
}

/** Rough content-completeness score for reports. It is not the indexability gate. */
export function contentCompleteness(content: Partial<MatrixContent> | undefined): number {
  if (!content) {
    return 0;
  }

  const fields: (keyof MatrixContent)[] = [
    "introduction",
    "verifiedCoverage",
    "propertyTypes",
    "applications",
    "installationDetails",
    "maintenance",
    "faqs",
    "source",
  ];
  const filled = fields.filter((field) => {
    const value = content[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;

  return Math.round((filled / fields.length) * 100);
}
