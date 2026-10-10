import { site } from "@/data/site";

export function FloatingActions() {
  const phone = site.phoneDisplay && site.phoneTel;
  const whatsapp = site.whatsapp.replace(/\D/g, "");
  const actions = [
    phone ? { href: `tel:${site.phoneTel}`, label: "Call", external: false } : null,
    whatsapp ? { href: `https://wa.me/${whatsapp}`, label: "WhatsApp", external: true } : null,
    site.email ? { href: `mailto:${site.email}`, label: "Email", external: false } : null,
    { href: "/contact", label: "Inspection", external: false },
  ].filter((item) => item !== null);

  return (
    <div className="fixed right-3 bottom-3 z-30 flex flex-col gap-2">
      {actions.map((action) => (
        <a
          key={action.label}
          className="inline-flex size-14 items-center justify-center rounded-full bg-navy text-[0.68rem] font-extrabold tracking-wide text-[#f3e6c8] no-underline shadow-[0_10px_24px_rgb(31_28_25_/_0.22)]"
          href={action.href}
          aria-label={action.label}
          {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label === "Inspection" ? "Visit" : action.label === "WhatsApp" ? "WA" : action.label}
        </a>
      ))}
    </div>
  );
}
