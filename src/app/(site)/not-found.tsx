import type { Metadata } from "next";
import { NotFoundBody } from "@/components/NotFoundBody";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function SiteNotFound() {
  return <NotFoundBody />;
}
