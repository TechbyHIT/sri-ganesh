import type { Metadata } from "next";
import { absoluteUrl } from "@/seo/urls";
import { InstallationGallery } from "@/components/InstallationGallery";
import { SiteModules } from "@/components/SiteModules";
import { DistrictList } from "@/components/Articles";
import { cities, citiesIn, regions } from "@/data/cities";
import { galleryCards, heroImage } from "@/data/gallery";
import { CardLink, GoldLink, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Invisible Grills and Safety Nets across Andhra Pradesh",
  description:
    "City-by-city measurement for invisible grills, safety nets, pigeon nets and cloth hangers in all 26 districts of Andhra Pradesh.",
  alternates: { canonical: absoluteUrl("/locations") },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Entire Andhra Pradesh"
        title="Locations we measure"
        highlight="Uttarandhra, coast and Rayalaseema"
        text="Primary city pages cover the main residential centres. Every district still has a named hub, and towns off the list are booked once travel and a useful slot are confirmed."
        image={heroImage("locations-index", "balcony-safety-nets")}
        crumbs={[{ href: "/", label: "Home" }, { label: "Locations" }]}
        actions={<GoldLink href="/locations/andhra-pradesh">Open the state page</GoldLink>}
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        {regions.map((region) => (
          <section key={region}>
            <h2 className="font-display text-2xl font-bold">{region}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-brand-800/75">
              {region === "Uttarandhra"
                ? "Salt air and high-rises lead the material talk, from Srikakulam through Visakhapatnam to the Anakapalli belt."
                : region === "Coastal Andhra"
                  ? "Humidity, apartment ducts and delta towns run from Kakinada and Rajamahendravaram down through Vijayawada, Guntur and Nellore."
                  : "Hotter, drier districts from Tirupati and Kadapa to Anantapur, Kurnool and Nandyal. UV and dust matter more than sea salt."}
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {citiesIn(region).map((city) => (
                <CardLink key={city.slug} href={`/locations/andhra-pradesh/${city.slug}`} title={city.name} text={city.intro} />
              ))}
            </div>
          </section>
        ))}
        <section>
          <h2 className="font-display text-2xl font-bold">All 26 districts</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-brand-800/75">
            {cities.length} cities have their own page. The district list is the coverage promise: if you live in Andhra Pradesh, start here and name the town.
          </p>
          <div className="mt-4">
            <DistrictList />
          </div>
        </section>
      </div>
      <SiteModules />
      <InstallationGallery photos={galleryCards("locations-index", 6)} compact title="The openings we see in these towns" text="Coastal salt air, delta humidity and Rayalaseema sun change the fitting. The photographs show the systems, not a fake map of every job." />
    </>
  );
}
