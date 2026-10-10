import Link from "next/link";
import { site } from "@/data/site";

export function ContactActions({ quoteHref = "/contact" }: { quoteHref?: string }) {
  const phone = site.phoneDisplay && site.phoneTel;
  const whatsapp = site.whatsapp.replace(/\D/g, "");

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {phone ? (
        <a className="button buttonPrimary" href={`tel:${site.phoneTel}`}>
          Call
        </a>
      ) : null}
      {whatsapp ? (
        <a className="button buttonGhost" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      ) : null}
      <Link className="button buttonPrimary" href={quoteHref}>
        Free quote
      </Link>
    </div>
  );
}
