import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/import", label: "Import CSV" },
  { href: "/admin/pages", label: "SEO pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/images", label: "Images" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-brand-50 lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="bg-brand-950 px-4 py-5 text-white lg:min-h-screen">
        <Link href="/admin" className="block font-display text-lg font-bold">
          Sri Ganesha <span className="text-cta-500">SEO admin</span>
        </Link>
        <nav aria-label="Admin" className="mt-6 flex gap-1 overflow-x-auto lg:flex-col">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
          <a href="/" className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-cta-500 hover:bg-white/10">
            View site ↗
          </a>
        </nav>
      </aside>
      <main id="content" className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
