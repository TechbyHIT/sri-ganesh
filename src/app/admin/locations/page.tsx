import { getActiveCities, getActiveLocalities } from "@/lib/locations";

export default function AdminLocationsPage() {
  const cities = getActiveCities();
  const localities = getActiveLocalities();

  return (
    <article>
      <h1>Locations</h1>
      <p className="mt-3">Served cities and localities. Districts and mandals stay administrative and are not published as service pages.</p>
      <ul className="mt-4 grid list-none gap-2 p-0">
        {cities.map((city) => (
          <li key={city.slug}>
            {city.name} ({city.slug})
          </li>
        ))}
        {localities.map((locality) => (
          <li key={locality.slug}>
            {locality.name}, {locality.city} ({locality.slug})
          </li>
        ))}
      </ul>
    </article>
  );
}
