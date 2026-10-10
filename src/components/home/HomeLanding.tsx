import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/Faq/Faq";
import { HeroSlider } from "@/components/home/HeroSlider";
import { InspectionForm } from "@/components/home/InspectionForm";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import {
  chipServices,
  enquiryCities,
  galleryItems,
  heroSlides,
  homeFaqs,
  materials,
  offerCards,
  projectCards,
  propertyTypes,
  readingCards,
  reasons,
  solutions,
  steps,
  trustPoints,
} from "@/data/home-landing";
import { guides } from "@/data/guides";
import { serviceLocations } from "@/data/serviceLocations";
import { site } from "@/data/site";
import { serviceCityPath, servicePath } from "@/lib/paths";

const publishedPairs = new Set(
  serviceLocations.filter((item) => item.active && item.indexable).map((item) => `${item.locationSlug}:${item.serviceSlug}`),
);

const formCities = enquiryCities.map((city) => ({ slug: city.slug, name: city.name }));

export function HomeLanding() {
  const phone = site.phoneDisplay && site.phoneTel;

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <section id="inspect" className="pb-14" aria-labelledby="inspect-title">
        <div className="container grid items-start gap-8 rounded-[1.75rem] border border-[#e7d7b8] bg-paper p-5 shadow-[0_16px_40px_rgb(176_137_72_/_0.08)] min-[60rem]:grid-cols-[0.9fr_1.1fr] min-[60rem]:p-8">
          <div>
            <SectionHeading
              eyebrow="Free site inspection"
              title="Tell us the opening before a price is treated as final."
              intro="Vijayawada is the primary city. Visakhapatnam, Kakinada, Rajahmundry, and the other towns below can be selected. A selection is a request for a visit, not a published service page."
              titleId="inspect-title"
            />
          </div>
          <InspectionForm cities={formCities} />
        </div>
      </section>

      <section className="pb-14" aria-labelledby="trust-title">
        <div className="container">
          <h2 id="trust-title" className="sr-only">
            What this homepage can say
          </h2>
          <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 min-[64rem]:grid-cols-5">
            {trustPoints.map((point) => (
              <li key={point.label} className="rounded-3xl border border-line bg-paper px-4 py-5 shadow-[0_10px_30px_rgb(28_25_23_/_0.04)]">
                <p className="text-2xl font-extrabold tracking-tight text-teal">{point.value}</p>
                <p className="mt-1 text-sm text-muted">{point.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="chips-title">
        <div className="container">
          <SectionHeading
            eyebrow="Find a fitting"
            title="Service names people ask for, by town."
            intro="A chip opens a published city page when that service and town are already paired. Otherwise it opens the service page. Unpublished towns stay on the inspection form."
            titleId="chips-title"
          />
          <div className="mt-6 grid gap-3">
            {enquiryCities.map((city) => (
              <details key={city.slug} className="rounded-3xl border border-line bg-paper px-4 py-2" {...(city.slug === "vijayawada" ? { open: true } : {})}>
                <summary className="min-h-11 cursor-pointer py-3 font-extrabold">{city.name}</summary>
                <ul className="flex flex-wrap gap-2 pb-4">
                  {chipServices.map((service) => {
                    const live = publishedPairs.has(`${city.slug}:${service.slug}`);
                    const href = live ? serviceCityPath(service.slug, city.slug) : servicePath(service.slug);

                    return (
                      <li key={`${city.slug}-${service.label}`} className="list-none">
                        <Link
                          className="inline-flex min-h-11 items-center rounded-full border border-[#e7d7b8] bg-[#fbfaf7] px-3 text-sm font-bold text-navy no-underline"
                          href={href}
                          title={live ? `${service.label} in ${city.name}` : `${service.label}. ${city.name} is not a published service page yet.`}
                        >
                          {service.label} in {city.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="pb-14" aria-labelledby="offers-title">
        <div className="container">
          <SectionHeading
            eyebrow="Services"
            title="The work, named by the opening."
            intro="Pigeon mesh, child nets, pet nets, terrace nets, and cricket lanes are planned through the published services below. They are not extra city pages."
            titleId="offers-title"
          />
          <div className="mt-6 grid gap-5 min-[60rem]:grid-cols-2">
            {offerCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_16px_40px_rgb(28_25_23_/_0.05)]">
                <Image src={card.image} alt={card.alt} width={800} height={560} className="aspect-[16/10] w-full bg-[#f6f0e4] object-cover" />
                <div className="grid gap-3 p-5">
                  <h3 className="text-2xl font-extrabold tracking-tight">{card.title}</h3>
                  <p className="text-muted">{card.summary}</p>
                  <ul className="flex flex-wrap gap-2">
                    {card.points.map((point) => (
                      <li key={point} className="list-none rounded-full bg-[#f6f0e4] px-3 py-1 text-sm font-bold text-teal">
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <Link className="button buttonGhost" href={servicePath(card.serviceSlug)}>
                      View details
                    </Link>
                    <a className="button buttonPrimary" href="#inspect">
                      {phone ? "Call for a visit" : "Book a visit"}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="materials-title">
        <div className="container">
          <SectionHeading
            eyebrow="Materials"
            title="Materials that can be specified."
            intro="A brand is written on the quote only when that product is the one being supplied. These cards are material types, not a stock list."
            titleId="materials-title"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 min-[64rem]:grid-cols-3">
            {materials.map((item) => (
              <article key={item.name} className="rounded-[1.5rem] border border-line bg-paper p-5">
                <h3 className="text-xl font-extrabold">{item.name}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
                <ul className="mt-3 grid gap-1 text-sm">
                  {item.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-bold text-teal">Warranty: named on that quote, not as a single published range.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="property-title">
        <div className="container">
          <SectionHeading
            eyebrow="Places we measure"
            title="Apartments, houses, schools, and grounds."
            intro="These are property types. They are not client names, and a type is not a completed project list."
            titleId="property-title"
          />
        </div>
        <div className="mt-6 overflow-hidden">
          <ul className="home-marquee flex w-max gap-3 px-4">
            {[...propertyTypes, ...propertyTypes].map((name, index) => (
              <li key={`${name}-${index}`} className="list-none rounded-full border border-[#e7d7b8] bg-paper px-5 py-3 font-extrabold whitespace-nowrap">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeading
            eyebrow="Recent work"
            title="The kind of opening, and the town people ask about."
            intro="Photos show the fitting, not a named apartment or a review. A town marked as an enquiry does not have a published service page yet."
            titleId="projects-title"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 min-[64rem]:grid-cols-3">
            {projectCards.map((project) => (
              <article key={project.title} className="overflow-hidden rounded-[1.5rem] border border-line bg-paper">
                <Image src={project.src} alt={project.alt} width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-extrabold">{project.title}</h3>
                  <p className="text-sm font-bold text-teal">{project.place}</p>
                  <p className="mt-2 text-sm text-muted">{project.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="steps-title">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="Five steps, from the form to handover." titleId="steps-title" />
          <ol className="mt-6 grid list-none gap-4 p-0 min-[60rem]:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-[1.5rem] border border-line bg-paper p-4">
                <p className="text-sm font-extrabold text-teal">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-extrabold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="reasons-title">
        <div className="container">
          <SectionHeading eyebrow="Why enquire here" title="What Sri Ganesha will and will not claim." titleId="reasons-title" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 min-[64rem]:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title} className="rounded-[1.5rem] bg-[#1f1c19] p-5 text-[#fbfaf7]">
                <h3 className="text-xl font-extrabold text-[#d4b483]">{reason.title}</h3>
                <p className="mt-2 text-white/80">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="reviews-title">
        <div className="container">
          <SectionHeading
            eyebrow="Reviews"
            title="Customer quotes are published after a job is confirmed."
            intro="No star rating, customer name, or review count is shown until that record exists. Visakhapatnam, Kakinada, Rajahmundry, Vizianagaram, Srikakulam, and Eluru are places an enquiry can name. They are not testimonials."
            titleId="reviews-title"
          />
        </div>
      </section>

      <section className="pb-14" aria-labelledby="solutions-title">
        <div className="container">
          <SectionHeading eyebrow="What are you looking for?" title="Start from the problem, then open the matching page." titleId="solutions-title" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 min-[64rem]:grid-cols-4">
            {solutions.map((item) => (
              <Link key={item.title} className="rounded-[1.5rem] border border-line bg-paper p-4 text-navy no-underline" href={item.href}>
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="guides-title">
        <div className="container">
          <SectionHeading
            eyebrow="Walkthroughs"
            title="Read the process before you expect a video."
            intro="Installation videos are added when a real job is filmed. These guides are the pages that exist today."
            titleId="guides-title"
          />
          <div className="mt-6 grid gap-4 min-[60rem]:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.slug} className="rounded-[1.5rem] border border-line bg-paper p-5">
                <p className="text-sm font-extrabold text-teal">Guide</p>
                <h3 className="mt-2 text-xl font-extrabold">{guide.title}</h3>
                <p className="mt-2 text-muted">{guide.description}</p>
                <Link className="mt-4 inline-flex min-h-11 items-center font-extrabold text-teal no-underline" href={`/guides/${guide.slug}`}>
                  Read the guide
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="gallery-title">
        <div className="container">
          <SectionHeading
            eyebrow="Gallery"
            title="Fittings and details, each shown once."
            titleId="gallery-title"
          />
          <ul className="mt-6 grid list-none gap-3 p-0 sm:grid-cols-2 min-[64rem]:grid-cols-3">
            {galleryItems.map((item) => (
              <li key={item.src} className="overflow-hidden rounded-[1.5rem] border border-line bg-paper">
                <Image src={item.src} alt={item.alt} width={1200} height={900} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <p className="px-4 py-3 text-sm font-bold">{item.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq
        items={homeFaqs.map((item, index) => ({ id: `home-${index}`, question: item.question, answer: item.answer }))}
        title="Questions before a site visit"
        intro="Straight answers. A city named in an answer is not a new service page."
      />

      <section className="pb-14" aria-labelledby="seo-title">
        <div className="container">
          <article className="max-w-3xl">
            <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Andhra Pradesh</p>
            <h2 id="seo-title" className="mt-2 text-[clamp(1.7rem,4vw,2.6rem)] leading-tight font-extrabold tracking-tight">
              Safety nets, invisible grills, and pigeon mesh in Andhra Pradesh
            </h2>
            <div className="mt-4 grid gap-4 text-muted">
              <p>
                Sri Ganesha Home Safety Solutions measures balconies, shafts, ledges, and practice grounds before a fitting is quoted. Vijayawada is the primary city. A homepage can name other towns. It should not pretend each town already has a crew and a price list.
              </p>
              <h3 className="text-ink">Why a safety net is discussed at all</h3>
              <p>
                An open balcony, a ventilator over a shaft, or a terrace parapet is a gap someone can misjudge. A net is one way to reduce that gap. It has to be tied to a surface that can hold it, and it has to leave the door usable. The same sentence does not describe a sports bay. That job is poles and a pitch, not a flat railing.
              </p>
              <h3 className="text-ink">Pigeon mesh and bird spikes</h3>
              <p>
                Pigeons use ledges, window bays, and the top of a duct. A fine mesh keeps them out of that opening. Spikes are for a narrow landing strip, such as a beam or a sign, and they are the wrong product across a doorway. Visakhapatnam and Tirupati have published spike pages. Duct nets are published for Visakhapatnam, Kakinada, and Rajahmundry.
              </p>
              <h3 className="text-ink">Balcony nets, children, and pets</h3>
              <p>
                A balcony net is the closer cover. Families ask for it when children or pets use the opening, or when objects should not fall from a storage balcony. Invisible grills are the clearer option when the view matters and wires can be spaced for that household. Guntur has the published balcony-net page. Child and pet pages on this site explain the problem and point back to that service.
              </p>
              <h3 className="text-ink">Invisible grills</h3>
              <p>
                Wires in slim channels leave the balcony visually open. They do not make the balcony a room, and they do not block weather. Published invisible-grill pages exist for Vijayawada and Visakhapatnam, including Madhurawada and Gajuwaka under Visakhapatnam. Spacing is set at measurement.
              </p>
              <h3 className="text-ink">Cloth hangers and sports nets</h3>
              <p>
                Ceiling, wall, and pulley hangers are one service: drying that does not hang on the safety fitting. Vijayawada and Guntur have published hanger pages. Sports nets and cricket lanes are measured on the ground. Tirupati has the published sports-net page.
              </p>
              <h3 className="text-ink">Materials and the visit</h3>
              <p>
                Stainless wire, HDPE or nylon mesh, braided or twisted sports mesh, spike strip, and aluminium or stainless drying rods are the types that can be specified. Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.
              </p>
              <h3 className="text-ink">Towns people ask about</h3>
              <p>
                Visakhapatnam enquiries that match a published service open that city page. Kakinada and Rajahmundry currently publish duct nets. Vizianagaram, Srikakulam, Eluru, Tadepalligudem, Anakapalli, Narsipatnam, and Yelamanchili can be selected on the form. Yelamanchili is the spelling used in the local directory. None of those seven towns is a published service city yet.
              </p>
              <h3 className="text-ink">Why the next step is a measurement</h3>
              <p>
                Sri Ganesha does not publish customer counts, star ratings, or a warranty range on this page. The useful next step is a photo of the opening and a visit in Vijayawada or another town you name. If the surface cannot hold an anchor, the visit says so before any work is booked.
              </p>
              <a className="button buttonPrimary w-fit" href="#inspect">
                Ask for a site inspection
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="pb-14" aria-labelledby="reading-title">
        <div className="container">
          <SectionHeading
            eyebrow="Reading"
            title="Guides that are live. Price posts are not."
            intro="Articles with city prices are not published, because a rate before measurement would be invented. These three guides are the current reading list."
            titleId="reading-title"
          />
          <div className="mt-6 grid gap-4 min-[60rem]:grid-cols-3">
            {readingCards.map((card) => (
              <article key={card.href} className="rounded-[1.5rem] border border-line bg-paper p-5">
                <p className="text-sm font-bold text-muted">{card.meta}</p>
                <h3 className="mt-2 text-xl font-extrabold">{card.title}</h3>
                <p className="mt-2 text-muted">{card.text}</p>
                <Link className="button buttonGhost mt-4" href={card.href}>
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16" aria-labelledby="contact-title">
        <div className="container grid gap-6 rounded-[1.75rem] border border-line bg-paper p-5 min-[60rem]:grid-cols-2 min-[60rem]:p-8">
          <div>
            <SectionHeading eyebrow="Contact" title="Ask for a measurement." titleId="contact-title" />
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="font-extrabold">Phone</dt>
                <dd className="text-muted">{phone ? <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a> : "Added when a number is confirmed."}</dd>
              </div>
              <div>
                <dt className="font-extrabold">WhatsApp</dt>
                <dd className="text-muted">{site.whatsapp || "Added when a number is confirmed."}</dd>
              </div>
              <div>
                <dt className="font-extrabold">Email</dt>
                <dd className="text-muted">{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : "Added when an address is confirmed."}</dd>
              </div>
              <div>
                <dt className="font-extrabold">Address</dt>
                <dd className="text-muted">No street address is listed until one is confirmed.</dd>
              </div>
              <div>
                <dt className="font-extrabold">Working hours</dt>
                <dd className="text-muted">Hours are agreed with the visit. They are not printed as a standing timetable yet.</dd>
              </div>
            </dl>
            <div className="mt-4 grid min-h-40 place-items-center rounded-3xl border border-dashed border-[#d4b483] bg-[#fbfaf7] p-4 text-center text-sm text-muted">
              A map is added with the confirmed address.
            </div>
          </div>
          <InspectionForm cities={formCities} />
        </div>
      </section>
    </>
  );
}
