import Image from "next/image";
import Link from "next/link";
import { site, whatsappHref } from "@/config/site";
import { cardImage, galleryCards } from "@/data/gallery";
import { searchOptions } from "@/data/search-options";
import { statItems } from "@/data/stats";
import { posts } from "@/data/blog";
import { cities, citiesIn, districts, regions } from "@/data/cities";
import { generalFaqs } from "@/data/faq";
import { materials, propertyTypes, reasons, steps } from "@/data/materials";
import { services } from "@/data/services";
import { popularLinks } from "@/lib/pages";
import { InstallationGallery } from "./InstallationGallery";
import { HeroSearch } from "./HeroSearch";
import { SpaceHero } from "./SpaceHero";
import { CheckList, FaqStatic, GoldLink, SectionTitle, WhatsLink } from "./ui";

const slides = [
  {
    title: "Invisible grills",
    highlight: "across Andhra Pradesh",
    text: "Tensioned stainless cables for balconies and windows, measured for coastal salt air and inland sun before a grade is named.",
  },
  {
    title: "Balcony safety nets",
    highlight: "for apartments and houses",
    text: "Mesh from railing to slab on straight, L-shaped and column-broken balconies in Visakhapatnam, Vijayawada, Guntur, Tirupati and beyond.",
  },
  {
    title: "Pigeon nets and spikes",
    highlight: "without harming the birds",
    text: "Close the balcony or duct they enter. Spike only the ledge they sit on. The choice follows the roost, not a package.",
  },
];

export function HomePage() {
  const wa = whatsappHref("Hello Sri Ganesha, I would like a free site measurement in Andhra Pradesh.");
  return (
    <>
      <section className="bg-brand-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <SpaceHero
            slides={[
              ["balcony-safety-nets", "69216efedf9f", "Balcony safety nets", "Mesh planned around the opening you actually use.", "Balcony safety net over a city view, fitted from the railing to the slab"],
              ["pigeon-nets", "b6cd8b63efb0", "Pigeon protection", "Close the volume birds enter. Leave a labelled way to clean it.", "Apartment elevation closed with pigeon mesh across balconies and windows"],
              ["invisible-grills", "05e89f6ead39", "Invisible grills", "Cable that keeps the outlook open and the fall gap closed.", "Stainless invisible grill cables on an apartment balcony"],
              ["cloth-hangers", "d3b98bc71d5a", "Cloth hangers", "Overhead drying that does not fight the safety line.", "Ceiling cloth drying rack on an open balcony"],
              ["cricket-nets", "23c2ef941bb1", "Cricket practice nets", "Bays sized to the ground, not to a balcony price.", "Outdoor cricket practice cage on a grass ground"],
            ].map(([service, id, kicker, line, alt]) => ({
              href: `/services/${service}`,
              src: `/gallery/hero/${id}.webp`,
              alt,
              kicker,
              line,
            }))}
          />
          <div className="mt-8">
            <HeroSearch options={searchOptions()} />
          </div>
          <ul className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {[
              ["A fit for your opening", "Measurements, edges and fixing points"],
              ["Options for everyday living", "View, airflow, cleaning and who uses the space"],
              ["Find your local pages", "Cities, neighbourhoods and the district hub"],
            ].map(([title, text]) => (
              <li key={title}>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/70">{text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {statItems.map((item, index) => (
              <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cta-500">0{index + 1}</p>
                <p className="mt-1 font-display text-3xl font-extrabold">{item.value}</p>
                <p className="mt-1 text-xs text-white/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Featured systems"
          title="Three fittings most homes start with"
          text="A balcony net, a pigeon enclosure, and a cable grill solve different problems. The visit decides which one the opening actually needs."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["balcony-safety-nets", "pigeon-nets", "invisible-grills"].map((slug) => {
            const service = services.find((item) => item.slug === slug);
            if (!service) return null;
            return (
              <article key={slug} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand-100">
                <div className="relative h-52">
                  <Image src={cardImage(`featured:${slug}`, slug)} alt={service.name} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-2xl font-bold">
                    <Link href={`/services/${slug}`}>{service.name}</Link>
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-brand-800/75">{service.summary}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cta-500">Thoughtful fitting</p>
            <h2 className="mt-3 font-display text-3xl font-bold">The opening decides the system</h2>
            <p className="mt-4 text-sm leading-7 text-white/75">
              A straight balcony, a duct with a pipe, and a practice bay are not the same job. We measure the edges that can take a hook or an anchor, then choose mesh, cable, or a drying line that still lets the room be used.
            </p>
          </div>
          <ol className="grid gap-3">
            {[
              ["Show the space", "City, a full photo of the opening, and closer photos of the top and side fixing surfaces."],
              ["Plan the fitting", "Size, grade, access, and what stays usable after the work — view, airflow, cleaning, or play."],
              ["Fit, check, hand over", "The line is installed, tension or mesh is checked, and you see how to clean or release an edge."],
            ].map(([title, text], index) => (
              <li key={title} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs font-bold text-cta-500">0{index + 1}</p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Estimate" title="What shapes your estimate?" text="A photo starts the conversation. The written figure follows a measurement of the opening you actually have." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Size", "Width, height, and the extra line around columns, pipes, and returns."],
            ["Specification", "Mesh type, cable grade, and whether the coast or inland sun changes the material."],
            ["Access", "Floor, scaffolding, society hours, and how long the opening takes to reach."],
            ["Included work", "Hooks, a cleaning edge, spikes on a ledge, or a drying line planned with the net."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-brand-100 bg-white p-5">
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-800/75">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Andhra Pradesh"
          title="Invisible grills, safety nets and pigeon protection for the whole state"
          text="Uttarandhra, the coastal districts and Rayalaseema are one service area. A Visakhapatnam balcony facing the Bay and a Kurnool terrace in dry heat are not specified the same way. The visit is where that difference is written down."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Uttarandhra", "Visakhapatnam, Vizianagaram, Srikakulam and the Anakapalli belt. Salt air and high-rises lead the material talk."],
            ["Coastal Andhra", "From Kakinada and Rajamahendravaram through Vijayawada and Guntur to Nellore. Humidity, ducts and dense apartments."],
            ["Rayalaseema", "Tirupati, Kadapa, Anantapur, Kurnool, Nandyal and the southern districts. UV and dust lead; salt usually does not."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-brand-800/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Locations" title="Popular searches by city" text="Every city page lists the services we fit there, the local climate note, and neighbourhoods. Towns without a page are still booked from the district hub." />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {regions.map((region) => (
            <div key={region}>
              <h3 className="font-display text-lg font-bold">{region}</h3>
              <ul className="mt-3 space-y-2">
                {citiesIn(region).map((city) => (
                  <li key={city.slug}>
                    <Link href={`/locations/andhra-pradesh/${city.slug}`} className="text-sm font-medium text-brand-800 hover:text-cta-600">
                      {city.name}
                      <span className="ml-2 text-brand-800/50">{city.district}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow="Searches" title="Work homeowners ask for by name" />
          <div className="mt-6 flex flex-wrap gap-2">
            {popularLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full bg-white px-3 py-2 text-sm font-medium text-brand-900 ring-1 ring-brand-100 hover:ring-cta-500">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Materials" title="What we are willing to name" text="Warranty length is stated on the quote for that job. We do not print a single year-range for every net and cable in the state." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((item) => (
            <article key={item.name} className="rounded-3xl border border-brand-100 bg-white p-5">
              <h3 className="font-display text-lg font-bold">{item.name}</h3>
              <CheckList items={item.points} />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Openings" title="Trusted across property types" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {propertyTypes.map((item) => (
                <article key={item.title} className="rounded-3xl bg-surface p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-800/75">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-[2rem]">
            <Image src={cardImage("apartments", "balcony-safety-nets")} alt="Apartment blocks of the kind measured for balcony safety across Andhra Pradesh" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Process" title="How installation works" text="A clear path from the first message to handover, for a busy flat or a school ground." />
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-brand-100 bg-white p-4">
              <p className="font-display text-2xl font-extrabold text-cta-500">0{index + 1}</p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-800/75">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-brand-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Why choose Sri Ganesha</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">Practical safety, a named material, and a service map that really is the whole of Andhra Pradesh.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, index) => (
              <article key={reason.title} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs font-bold text-cta-500">0{index + 1}</p>
                <h3 className="mt-2 font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InstallationGallery
        photos={galleryCards("home", 8)}
        eyebrow="Installations"
        title="Invisible grills, safety nets and bird protection — as fitted"
        text="A masonry of real balcony, window, duct, hanger and sports-net work. The same systems we measure across Andhra Pradesh."
      />

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionTitle eyebrow="Questions" title="Before you book the visit" />
            <div className="mt-6">
              <FaqStatic items={generalFaqs.slice(0, 5)} />
            </div>
            <Link href="/faq" className="mt-4 inline-flex text-sm font-semibold">
              All questions
            </Link>
          </div>
          <div>
            <SectionTitle eyebrow="Guides" title="Plain-language notes" />
            <ul className="mt-6 space-y-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="block rounded-3xl border border-brand-100 p-4 hover:border-cta-500">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cta-600">{post.kicker}</p>
                    <p className="mt-1 font-semibold">{post.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle eyebrow="Coverage" title="All 26 districts, with a named hub" text="If your town is not in the city list, it is still in Andhra Pradesh and still in scope. We confirm the slot from the hub beside it." />
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((district) => (
            <p key={district.name} className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-brand-100">
              <span className="font-semibold">{district.name}</span>
              <span className="text-brand-800/60"> · via {district.hub}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="bg-brand-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Get a free site inspection</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
              Tell us the district, the opening and the worry — children, pets, pigeons, drying or a practice net. We answer with a visit slot where we serve.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <GoldLink href="/contact">Request a visit</GoldLink>
              {wa ? <WhatsLink href={wa}>WhatsApp</WhatsLink> : null}
            </div>
          </div>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{site.hours}</li>
            <li>{site.email}</li>
            <li>{site.address}</li>
            {slides.map((slide) => (
              <li key={slide.title} className="text-white/60">
                {slide.title} — {slide.highlight}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
