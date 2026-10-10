import Link from "next/link";
import { serviceAreaIntro } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { getPublishedCities } from "@/lib/content";
import { cityAnchor } from "@/lib/paths";

export function ServiceAreas() {
  const cities = [...getPublishedCities()].sort((left, right) => {
    if (left.slug === "vijayawada") return -1;
    if (right.slug === "vijayawada") return 1;
    return left.name.localeCompare(right.name);
  });

  return (
    <section className="pb-14" aria-labelledby="areas-title">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={serviceAreaIntro.eyebrow}
            title={serviceAreaIntro.title}
            intro={serviceAreaIntro.intro}
            titleId="areas-title"
          />
          <Link className="inline-flex min-h-11 items-center font-extrabold text-teal no-underline" href="/locations">
            View all service areas
          </Link>
        </div>
        <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
          {cities.map((city) => (
            <li key={city.slug}>
              <Link
                className={`inline-flex min-h-11 items-center rounded-full border px-4 font-extrabold no-underline ${
                  city.slug === "vijayawada"
                    ? "border-transparent bg-navy text-white"
                    : "border-line bg-paper text-ink"
                }`}
                href={cityAnchor(city.slug)}
                prefetch={false}
              >
                {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
