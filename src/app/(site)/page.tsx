import type { Metadata } from "next";
import { site } from "@/config/site";
import { HomePage } from "@/components/HomePage";
import { staticMetadata } from "@/seo/metadata";

const homeTitle = "Invisible Grills & Safety Nets in Andhra Pradesh | Sri Ganesha";

export const metadata: Metadata = {
  ...staticMetadata({
    title: homeTitle,
    description: site.description,
    path: "/",
  }),
  title: { absolute: homeTitle },
};

export default function Page() {
  return <HomePage />;
}
