import type { MatrixApproval } from "@/lib/url-matrix/content-model";

/**
 * Matrix pages the business has approved.
 *
 * A candidate URL leaves review only when it has an entry here with:
 * - the business's own confirmation that the service is offered at that place,
 * - original content that passes the schema in lib/url-matrix/content-model.ts,
 * - a unique title and description.
 *
 * This list is empty today. No matrix URL is published, routed, or in a sitemap.
 * Do not add an entry to reach a count. Add one when the page has real local content.
 */
export const matrixApprovals: MatrixApproval[] = [];
