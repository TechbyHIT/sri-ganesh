"use client";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container py-12">
          <h1>This page could not be loaded.</h1>
          <button className="button buttonPrimary mt-6" type="button" onClick={() => retry()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
