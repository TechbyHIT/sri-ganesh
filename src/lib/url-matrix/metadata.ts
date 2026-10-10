import type { Metadata } from "next";
import { generatePathMetadata } from "@/lib/seo";
import type { PublishedMatrixPage } from "@/lib/url-matrix/published";

export function matrixMetadata(page: PublishedMatrixPage): Metadata {
  return generatePathMetadata({
    title: page.approval.title,
    description: page.approval.description,
    path: page.approval.path,
    indexable: true,
  });
}
