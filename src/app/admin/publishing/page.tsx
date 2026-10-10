export default function AdminPublishingPage() {
  return (
    <article>
      <h1>Publishing</h1>
      <p className="mt-3 max-w-3xl">
        Publishing runs from the command line with an explicit batch size of 500 or fewer. There is no control here that publishes every possible combination.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-navy p-4 text-sm text-[#f7f3ea]">{`npm run pages:create -- --type=service-location --limit=1000
npm run pages:audit -- --status=review --limit=1000
npm run pages:publish -- --batch-size=500
npm run pages:noindex -- --quality-below=80
npm run pages:count`}</pre>
    </article>
  );
}
