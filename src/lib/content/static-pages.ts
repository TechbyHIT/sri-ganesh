import { guides } from "@/data/guides";
import { problems } from "@/data/problems";
import { generatePathMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  indexable: boolean;
  priority: number;
  sections: ArticleSection[];
};

const pricing =
  "Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.";

export const staticPages: StaticPage[] = [
  {
    path: "/about",
    title: "About this home safety service",
    description:
      "Sri Ganesha Home Safety Solutions measures and installs home safety fittings for apartments and houses in Andhra Pradesh.",
    eyebrow: "About",
    h1: "About Sri Ganesha Home Safety Solutions",
    indexable: true,
    priority: 0.5,
    sections: [
      {
        heading: "What the business does",
        paragraphs: [
          "The work is measurement and installation of invisible grills, balcony safety nets, cloth hangers, sports nets, safety spikes, duct area nets, and temporary building covering.",
          "Pages are published for cities and localities that are actually served. A district or mandal can sit in the location database without being a service area.",
        ],
      },
      {
        heading: "What is still blank",
        paragraphs: [
          "Phone, WhatsApp, email, street address, and map coordinates stay empty until they are confirmed. This site does not invent an office in each city.",
          "Years in business, job counts, certifications, awards, and reviews are not stated here because they have not been verified for publication.",
        ],
      },
    ],
  },
  {
    path: "/contact",
    title: "Contact and quotations",
    description:
      "Ask for a measurement. Quotes are stored only when the database is connected. No phone number is shown until it is verified.",
    eyebrow: "Contact",
    h1: "Contact Sri Ganesha Home Safety Solutions",
    indexable: true,
    priority: 0.5,
    sections: [
      {
        heading: "How a quote starts",
        paragraphs: [
          "Share your name, phone, the service, and the city. The form is saved in PostgreSQL when the database is connected. Until then the form says so, instead of pretending the message was sent.",
          pricing,
        ],
      },
    ],
  },
  {
    path: "/gallery",
    title: "Project photographs",
    description: "Photographs are added after a job is finished and the customer agrees to publication.",
    eyebrow: "Gallery",
    h1: "Project photographs",
    indexable: false,
    priority: 0.2,
    sections: [
      {
        heading: "Nothing is published here yet",
        paragraphs: [
          "There are no project photographs on this page. Images will be added only from completed jobs, with permission, and with alt text that describes the picture.",
        ],
      },
    ],
  },
  {
    path: "/projects",
    title: "Projects",
    description: "Named projects are listed only after the customer and the site details are confirmed.",
    eyebrow: "Projects",
    h1: "Projects",
    indexable: false,
    priority: 0.2,
    sections: [
      {
        heading: "No named projects yet",
        paragraphs: [
          "This page stays empty until a real project can be described without inventing a customer, a building, or a result.",
        ],
      },
    ],
  },
  {
    path: "/testimonials",
    title: "Testimonials",
    description: "Reviews are published only when the customer and the job can be confirmed.",
    eyebrow: "Testimonials",
    h1: "Testimonials",
    indexable: false,
    priority: 0.2,
    sections: [
      {
        heading: "No reviews are shown",
        paragraphs: [
          "This site does not publish sample reviews, star ratings, or anonymous praise. A testimonial needs a confirmed customer and a confirmed job.",
        ],
      },
    ],
  },
  {
    path: "/faq",
    title: "Home safety questions",
    description:
      "Answers about coverage, measurement, and how invisible grills differ from balcony nets.",
    eyebrow: "FAQ",
    h1: "Questions before a site visit",
    indexable: true,
    priority: 0.5,
    sections: [],
  },
  {
    path: "/pricing-guide",
    title: "What changes a home safety quote",
    description:
      "A home safety quote follows the measurement. This page lists the factors and does not show a fixed price.",
    eyebrow: "Pricing",
    h1: "What changes the quote",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "No fixed price",
        paragraphs: [
          pricing,
          "A rate copied from another balcony would be wrong for a different opening. The form asks for the city and the service so the visit can be planned. It does not produce a final figure.",
        ],
      },
    ],
  },
  {
    path: "/materials-guide",
    title: "Materials used for home safety fittings",
    description:
      "Materials are chosen after the opening is measured. This page does not invent grades or warranty periods.",
    eyebrow: "Materials",
    h1: "Materials, chosen after measurement",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "What can be said now",
        paragraphs: [
          "Invisible grills use tensioned wire in channels. Balcony and duct nets use mesh. Spikes are a separate product for ledges where people do not stand. Building covering is a temporary sheet.",
          "Stainless-steel wire is used where salt air reaches the balcony, including the published Visakhapatnam work. A grade, a coating, or a warranty length is written on the quote after the visit, not on this page.",
        ],
      },
    ],
  },
  {
    path: "/installation-process",
    title: "How a home safety fitting is installed",
    description:
      "Installation follows a measurement of the opening, the fixing surface, the height, and the access.",
    eyebrow: "Installation",
    h1: "How installation is planned",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "Order of work",
        paragraphs: [
          "The opening is measured, including corners that are not square. The surface that will hold the anchors is checked. Access and building height are noted because they change the job.",
          "The fitting is then made to that opening. A cloth hanger is planned around an existing grill or net when both are needed, so the rod does not clash with the top channel.",
        ],
      },
    ],
  },
  {
    path: "/safety-guide",
    title: "Safety checks before a fitting is left",
    description:
      "The checks before a grill, net, or spike fitting is left in place. No product here is described as risk-free.",
    eyebrow: "Safety",
    h1: "Checks before the fitting is left",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "On the day",
        paragraphs: [
          "The anchors, the tension or the mesh, and the line of the opening are checked against the measurement. Spikes are refused for a surface where people stand.",
          "A fitting reduces a gap. It does not remove the need to supervise children or pets, and this page does not claim that it does.",
        ],
      },
    ],
  },
  {
    path: "/privacy-policy",
    title: "Privacy policy",
    description:
      "What the contact form stores, and the fact that analytics run only when an ID is set in the environment.",
    eyebrow: "Privacy",
    h1: "Privacy policy",
    indexable: true,
    priority: 0.3,
    sections: [
      {
        heading: "Messages you send",
        paragraphs: [
          "The quote form asks for your name, phone, WhatsApp number if you give one, service, city, area, property type, and message. It is stored in the project database when PostgreSQL is connected.",
          "Analytics and advertising tags load only when their IDs are present in environment variables. No tracking ID is written into the source.",
        ],
      },
    ],
  },
  {
    path: "/terms-and-conditions",
    title: "Terms and conditions",
    description:
      "Quotes follow a site measurement. Published pages describe the service. They are not a contract or a fixed price.",
    eyebrow: "Terms",
    h1: "Terms and conditions",
    indexable: true,
    priority: 0.3,
    sections: [
      {
        heading: "Quotes and pages",
        paragraphs: [
          "A page explains the service. The agreement is the quote after measurement. " + pricing,
          "Coverage is the cities and localities with published service pages. Administrative records for other places are not an offer to install there.",
        ],
      },
    ],
  },
  {
    path: "/disclaimer",
    title: "Disclaimer",
    description:
      "Service pages are information. They are not a safety certificate, a price list, or a promise of search rankings.",
    eyebrow: "Disclaimer",
    h1: "Disclaimer",
    indexable: true,
    priority: 0.3,
    sections: [
      {
        heading: "Limits of these pages",
        paragraphs: [
          "Google decides crawling, indexing, and rankings. This site does not promise positions, traffic, or leads.",
          "Local wording uses only the notes already written for a served place. Missing local facts are left out rather than filled in.",
        ],
      },
    ],
  },
  {
    path: "/thank-you",
    title: "Message received",
    description: "The quotation request was stored. This page is not indexed.",
    eyebrow: "Thank you",
    h1: "The request was stored",
    indexable: false,
    priority: 0.1,
    sections: [
      {
        heading: "What happens next",
        paragraphs: [
          "The message is in the database. Someone can reply only on the phone number you submitted. This page is not a public landing page.",
        ],
      },
    ],
  },
  {
    path: "/guides",
    title: "Home safety guides",
    description:
      "Short guides on materials, the difference between a net and a grill, and how a measurement works.",
    eyebrow: "Guides",
    h1: "Guides",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "What is published",
        paragraphs: [
          "Each guide answers one question. New guides are added when they have a purpose of their own, not a small change of wording.",
        ],
      },
    ],
  },
  {
    path: "/solutions",
    title: "Problems these fittings address",
    description:
      "Pages for child balcony safety, pets, ledge spikes, and shaft nets. Each one stays tied to a real service.",
    eyebrow: "Solutions",
    h1: "Problems the fittings are for",
    indexable: true,
    priority: 0.6,
    sections: [
      {
        heading: "Separate problems",
        paragraphs: [
          "A balcony gap, a ledge, and a shaft are different jobs. These pages point at the service that matches the problem instead of repeating one article with a new heading.",
        ],
      },
    ],
  },
  {
    path: "/property-types",
    title: "Property types we measure",
    description:
      "Apartments, independent houses, and high-rise access. Combination pages are published only after they pass review.",
    eyebrow: "Property types",
    h1: "Property types",
    indexable: true,
    priority: 0.5,
    sections: [
      {
        heading: "Why these are not city pages",
        paragraphs: [
          "The property type changes access and the opening. It does not create a new page for every service until that combination has its own reviewed copy.",
        ],
      },
    ],
  },
  {
    path: "/blog",
    title: "Articles",
    description: "Articles are published one at a time after review. None are live yet.",
    eyebrow: "Blog",
    h1: "Articles",
    indexable: false,
    priority: 0.2,
    sections: [
      {
        heading: "No articles yet",
        paragraphs: [
          "Blog posts will cover one customer question each. They are not created by swapping a city name through an existing service page.",
        ],
      },
    ],
  },
];

export function getStaticPage(path: string): StaticPage | undefined {
  return staticPages.find((page) => page.path === path);
}

export function staticMetadata(path: string): Metadata {
  const page = getStaticPage(path);

  if (!page) {
    return {};
  }

  return generatePathMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    indexable: page.indexable,
  });
}

export function indexableStaticPaths(): { path: string; priority: number }[] {
  const pages = staticPages
    .filter((page) => page.indexable)
    .map((page) => ({ path: page.path, priority: page.priority }));
  const guidePaths = guides
    .filter((guide) => guide.indexable)
    .map((guide) => ({ path: `/guides/${guide.slug}`, priority: 0.6 }));
  const problemPaths = problems
    .filter((problem) => problem.indexable)
    .map((problem) => ({ path: `/solutions/${problem.slug}`, priority: 0.6 }));

  return [...pages, ...guidePaths, ...problemPaths];
}
