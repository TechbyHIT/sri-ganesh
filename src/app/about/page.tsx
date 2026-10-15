import type { Metadata } from "next";
import { absoluteUrl } from "@/seo/urls";
import { InstallationGallery } from "@/components/InstallationGallery";
import { SiteModules } from "@/components/SiteModules";
import { galleryCards, heroImage } from "@/data/gallery";
import { CheckList, GhostLink, GoldLink, PageHero, Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Sri Ganesha Home Safety Solutions",
  description:
    "A measurement-led installer of invisible grills, safety nets, pigeon protection, cloth hangers and sports nets for the whole of Andhra Pradesh.",
  alternates: { canonical: absoluteUrl("/about") },
};

const points = [
  "We serve the entire state, not a single coastal pocket.",
  "Cable grade and mesh type are written in the quote.",
  "Salt air and inland UV are treated as different specifications.",
  "Bird control stays physical and humane.",
  "We do not publish invented ratings or install counts.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Safer openings, without the iron clutter"
        highlight="for Andhra Pradesh homes"
        text="Sri Ganesha Home Safety Solutions measures invisible grills, safety nets, cloth hangers, sports nets and bird spikes for balconies, windows, ducts and grounds across Andhra Pradesh."
        image={heroImage("about", "invisible-grills")}
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        actions={
          <>
            <GoldLink href="/contact">Request a measurement</GoldLink>
            <GhostLink href="/services">See the systems</GhostLink>
          </>
        }
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
        {[
          ["Vision", "Open balconies and windows that stay bright, ventilated and harder to fall through, from Srikakulam to Chittoor."],
          ["Mission", "Fit the system the opening needs, after a free measurement, with the material grade named in writing."],
          ["Promise", "No statewide price fiction, no poison for pigeons, and no star rating we did not earn."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-brand-100 bg-white p-6">
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-800/80">{text}</p>
          </article>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="font-display text-3xl font-bold">The fitting starts with the space</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["01", "Start with the opening", "Shape, railing condition, and the surfaces that can take a hook or an anchor decide the system."],
            ["02", "Think about daily use", "View, airflow, drying, children, pets, and cleaning access belong in the same plan."],
            ["03", "Keep the next step clear", "City, photos, and what the installation must do are enough to start. The written quote follows the visit."],
          ].map(([index, title, text]) => (
            <li key={title} className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
              <p className="font-display text-2xl font-extrabold text-cta-500">{index}</p>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-brand-800/75">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <CheckList items={points} />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-2">
        <Panel eyebrow="Regions" title="One state, three climates">
          <div className="space-y-4 text-sm leading-7 text-brand-800/80">
            <p>Uttarandhra — Visakhapatnam, Vizianagaram, Srikakulam and the Anakapalli belt — puts salt air on open balconies. Cable grade is a site conversation there, not a catalogue default.</p>
            <p>Coastal Andhra runs from Kakinada and Rajamahendravaram through Vijayawada and Guntur to Nellore. Humidity, ducts and dense apartments show up more often than a beach-facing ridge.</p>
            <p>Rayalaseema — Tirupati, Kadapa, Anantapur, Kurnool, Nandyal and the southern districts — is hotter and drier. UV and dust lead. Salt usually does not.</p>
          </div>
        </Panel>
        <Panel eyebrow="Quote" title="What a written estimate is expected to name">
          <CheckList
            items={[
              "The opening: balcony, window, duct, terrace, stair or a real practice ground.",
              "The system: cable, mesh, spikes, a drying line, or a sports net — and why that one.",
              "The grade: SS304 or SS316, mesh type, and the fixing surfaces.",
              "Access: floor, society hours, and whether a remote town changes the day.",
              "What is not included, so a second product on the same balcony is not hidden inside the first price.",
            ]}
          />
        </Panel>
      </div>
      <SiteModules />
      <InstallationGallery photos={galleryCards("about", 6)} compact title="How the finished work looks" text="Cable, mesh, ducts and hangers from the same systems we specify after a site visit." />
    </>
  );
}
