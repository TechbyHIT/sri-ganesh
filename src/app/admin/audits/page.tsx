export default function AdminAuditsPage() {
  return (
    <article>
      <h1>Audits</h1>
      <p className="mt-3 max-w-3xl">
        Audit scripts write JSON reports under reports/. They read the catalogue immediately and the database when DATABASE_URL is set.
      </p>
      <ul className="mt-4 grid list-none gap-2 p-0">
        <li>npm run seo:audit</li>
        <li>npm run content:audit</li>
        <li>npm run duplicates:audit</li>
        <li>npm run links:audit</li>
        <li>npm run schema:audit</li>
      </ul>
    </article>
  );
}
