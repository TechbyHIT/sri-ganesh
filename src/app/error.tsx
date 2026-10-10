"use client";

import Link from "next/link";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="container py-12 pb-16">
      <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Error</p>
      <h1 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.2rem)] leading-tight font-extrabold tracking-tight">This page could not be loaded.</h1>
      <p>The details stay on the server. You can try the page again, or go back to the home page.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="button buttonPrimary" type="button" onClick={() => retry()}>
          Try again
        </button>
        <Link className="button buttonGhost" href="/">
          Back to home
        </Link>
        <Link className="button buttonGhost" href="/services">
          View services
        </Link>
      </div>
    </div>
  );
}
