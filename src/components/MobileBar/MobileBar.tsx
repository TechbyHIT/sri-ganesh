import { site } from "@/data/site";

type Action = {
  href: string;
  label: string;
  external?: boolean;
};

export function MobileBar() {
  const actions: Action[] = [];

  if (site.phoneTel) {
    actions.push({ href: `tel:${site.phoneTel}`, label: "Call" });
  }

  const whatsappDigits = site.whatsapp.replace(/\D/g, "");

  if (whatsappDigits) {
    actions.push({
      href: `https://wa.me/${whatsappDigits}`,
      label: "WhatsApp",
      external: true,
    });
  }

  actions.push({ href: "#book", label: "Get Quote" });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-1.5 border-t border-white/15 bg-navy px-2 pt-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] min-[68rem]:hidden"
      aria-label="Quick contact"
    >
      {actions.map((action) => (
        <a
          key={action.label}
          className={
            action.label === "Get Quote"
              ? "inline-flex min-h-11 items-center justify-center rounded-full bg-saffron px-2 font-extrabold text-navy no-underline"
              : "inline-flex min-h-11 items-center justify-center rounded-full px-2 font-extrabold text-white no-underline"
          }
          href={action.href}
          {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label}
        </a>
      ))}
    </nav>
  );
}
