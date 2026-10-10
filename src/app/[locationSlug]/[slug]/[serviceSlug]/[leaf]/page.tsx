import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatrixPage } from "@/components/MatrixPage/MatrixPage";
import { getNotFoundMetadata } from "@/lib/seo";
import { matrixMetadata } from "@/lib/url-matrix/metadata";
import { getPublishedMatrixPage, getPublishedMatrixPaths } from "@/lib/url-matrix/published";

/**
 * Public URL: /{service}/{state}/{district}/{location}.
 * The folder names repeat the params of the shorter routes because Next.js needs one name per depth.
 * `locationSlug` is the service entry, `slug` is the state, `serviceSlug` is the district, `leaf` is the place.
 * Every request returns notFound() unless the business approved the page in data/matrix-approvals.ts.
 *
 * The route has no Suspense boundary on purpose. The lookup needs no request data, so an
 * unapproved URL answers with a real 404 status instead of a 200 shell followed by a not-found body.
 */
type Params = Promise<{ locationSlug: string; slug: string; serviceSlug: string; leaf: string }>;

/**
 * Next.js requires at least one static param when this function exists. With no approvals the single
 * entry is a reserved placeholder that is never a valid matrix path, so it renders the 404 page.
 */
export function generateStaticParams() {
  const approved = getPublishedMatrixPaths().flatMap((path) => {
    const [locationSlug, slug, serviceSlug, leaf] = path.split("/").slice(1);
    return locationSlug && slug && serviceSlug && leaf ? [{ locationSlug, slug, serviceSlug, leaf }] : [];
  });

  return approved.length > 0
    ? approved
    : [{ locationSlug: "_unpublished", slug: "_unpublished", serviceSlug: "_unpublished", leaf: "_unpublished" }];
}

async function pathFrom(params: Params): Promise<string> {
  const { locationSlug, slug, serviceSlug, leaf } = await params;
  return `/${locationSlug}/${slug}/${serviceSlug}/${leaf}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = getPublishedMatrixPage(await pathFrom(params));
  return page ? matrixMetadata(page) : getNotFoundMetadata();
}

export default async function MatrixLocationPage({ params }: { params: Params }) {
  const page = getPublishedMatrixPage(await pathFrom(params));

  if (!page) {
    notFound();
  }

  return <MatrixPage page={page} />;
}
