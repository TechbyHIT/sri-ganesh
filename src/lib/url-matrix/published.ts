import { matrixApprovals } from "@/data/matrix-approvals";
import { checkApproval, type MatrixApproval } from "@/lib/url-matrix/content-model";
import { resolveMatrixPath, type ResolvedMatrixPath } from "@/lib/url-matrix/generate";

export type PublishedMatrixPage = {
  approval: MatrixApproval;
  resolved: ResolvedMatrixPath;
};

function normalize(path: string): string {
  const clean = path.split(/[?#]/, 1)[0] ?? "";
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
}

/**
 * The only way a matrix URL becomes a page. Needs a valid approval AND a path that resolves
 * against the service catalog and the location tree. Returns null for everything else.
 * With no approvals this returns before any location data is touched.
 */
export function getPublishedMatrixPage(
  path: string,
  approvals: readonly MatrixApproval[] = matrixApprovals,
): PublishedMatrixPage | null {
  if (approvals.length === 0) {
    return null;
  }

  const canonical = normalize(path);
  const approval = approvals.find((item) => item.path === canonical);

  if (!approval || !checkApproval(approval).ok) {
    return null;
  }

  const resolved = resolveMatrixPath(canonical);
  return resolved ? { approval, resolved } : null;
}

/** Sitemap paths. Empty until the business approves a page. */
export function getPublishedMatrixPaths(approvals: readonly MatrixApproval[] = matrixApprovals): string[] {
  return approvals.filter((item) => getPublishedMatrixPage(item.path, approvals)).map((item) => item.path);
}

/** Approvals that cannot be published, with the reason. For audits. */
export function findInvalidApprovals(
  approvals: readonly MatrixApproval[] = matrixApprovals,
): { path: string; reasons: string[] }[] {
  const seen = new Set<string>();
  const problems: { path: string; reasons: string[] }[] = [];

  for (const approval of approvals) {
    const reasons = [...checkApproval(approval).reasons];

    if (seen.has(approval.path)) {
      reasons.push("duplicate approval path");
    }

    seen.add(approval.path);

    if (!resolveMatrixPath(approval.path)) {
      reasons.push("path does not resolve to a catalog entry and a location in the same district");
    }

    if (reasons.length > 0) {
      problems.push({ path: approval.path, reasons });
    }
  }

  return problems;
}
