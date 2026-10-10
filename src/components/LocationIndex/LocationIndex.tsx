import Link from "next/link";
import { seo } from "@/data/seo";
import { site } from "@/data/site";
import {
  getActiveCities,
  getAllDistricts,
  getCitiesByDistrict,
  getLocalitiesByCity,
  getMandalsByDistrict,
  getRevenueDivisionsByDistrict,
  getTownsByDistrict,
  countVillagesByDistrict,
} from "@/lib/locations";

export function LocationIndex() {
  const cities = getActiveCities();

  return (
    <div className="container py-8 pb-14">
      <header>
        <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">
          {site.region}, {site.country}
        </p>
        <h1 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.3rem)] leading-tight font-extrabold tracking-tight">{seo.locationsIndex.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{seo.locationsIndex.description}</p>
      </header>
      <div className="mt-7 grid gap-4">
        {cities.map((city) => {
          const localities = getLocalitiesByCity(city.slug).filter((item) => item.active);

          return (
            <section
              className="scroll-mt-28 rounded-2xl border border-line bg-paper p-5 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline [&_ul]:mt-4 [&_ul]:grid [&_ul]:gap-2 [&_ul]:pl-4 min-[48rem]:[&_ul]:grid-cols-2"
              id={city.slug}
              key={city.slug}
              aria-labelledby={`${city.slug}-title`}
            >
              <h2 id={`${city.slug}-title`}>
                <Link href={`/locations/${city.slug}`} prefetch={false}>
                  {city.name}
                </Link>
              </h2>
              <p>{city.description}</p>
              {localities.length > 0 ? (
                <ul>
                  {localities.map((locality) => (
                    <li key={locality.slug}>
                      <Link href={`/locations/${city.slug}/${locality.slug}`} prefetch={false}>
                        {locality.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
      <section className="mt-10" aria-labelledby="districts-title">
        <h2 id="districts-title">Districts on the state portal</h2>
        <p>
          {getAllDistricts().length} districts were listed on the Andhra Pradesh district portal. A district name is not a service page. Links appear only for city pages this site already publishes. Mandal names are shown only where an official district list has been imported.
        </p>
        <ul className="mt-5 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline [&_summary]:flex [&_summary]:min-h-11 [&_summary]:cursor-pointer [&_summary]:items-center [&_summary]:font-bold [&_summary]:text-teal">
          {getAllDistricts()
            .slice()
            .sort((left, right) => left.name.localeCompare(right.name))
            .map((district) => {
              const publishedCities = getCitiesByDistrict(district.id).filter((city) => city.indexable);
              const divisions = getRevenueDivisionsByDistrict(district.id);
              const mandals = getMandalsByDistrict(district.id);
              const towns = getTownsByDistrict(district.id);
              const villageCount = countVillagesByDistrict(district.id);

              return (
                <li key={district.id}>
                  <p>
                    <strong>{district.name}</strong>
                    {district.languageNames.te ? (
                      <span lang="te"> {district.languageNames.te}</span>
                    ) : null}
                  </p>
                  {publishedCities.length > 0 ? (
                    <p>
                      {publishedCities.map((city) => (
                        <Link key={city.id} href={`/locations/${city.slug}`} prefetch={false}>
                          {city.name} page
                        </Link>
                      ))}
                    </p>
                  ) : (
                    <p>No city page yet.</p>
                  )}
                  {divisions.length > 0 ? (
                    <p>Revenue divisions: {divisions.map((division) => division.name).join(", ")}.</p>
                  ) : null}
                  {mandals.length > 0 ? (
                    <details>
                      <summary>{mandals.length} mandals from the district list</summary>
                      <ul>
                        {mandals.map((mandal) => (
                          <li key={mandal.id}>{mandal.name}</li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <p>No mandal list was published on the district site.</p>
                  )}
                  {towns.length > 0 ? (
                    <details>
                      <summary>{towns.length} towns from the area lists</summary>
                      <ul>
                        {towns.map((town) => (
                          <li key={town.id}>{town.name}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                  {villageCount > 0 ? (
                    <p>{villageCount} villages from the Local Government Directory. They are not service pages.</p>
                  ) : null}
                </li>
              );
            })}
        </ul>
      </section>
    </div>
  );
}
