import Link from "next/link";
import { getNotFoundMetadata } from "@/lib/seo";

export const metadata = getNotFoundMetadata();

export default function NotFound() {
  return (
    <div className="container py-12 pb-16">
      <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">404</p>
      <h1 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.2rem)] leading-tight font-extrabold tracking-tight">That page is not on this site.</h1>
      <p>The service or location may be unpublished. Start from the services list or the city index.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="button buttonPrimary" href="/">
          Back to home
        </Link>
        <Link className="button buttonGhost" href="/services">
          View services
        </Link>
        <Link className="button buttonGhost" href="/locations">
          View locations
        </Link>
      </div>
    </div>
  );
}
