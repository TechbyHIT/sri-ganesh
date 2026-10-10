import type { ReactNode } from "react";
import Link from "next/link";
import { loginAdmin, logoutAdmin } from "@/app/admin/actions";
import { adminConfigured, isAdmin } from "@/lib/security/admin";

const links = [
  ["/admin", "Overview"],
  ["/admin/services", "Services"],
  ["/admin/locations", "Locations"],
  ["/admin/pages", "Pages"],
  ["/admin/publishing", "Publishing"],
  ["/admin/audits", "Audits"],
] as const;

export async function AdminGate({ children }: { children: ReactNode }) {
  if (!adminConfigured()) {
    return (
      <article className="container py-8 pb-16">
        <h1>Admin is off</h1>
        <p className="mt-3 max-w-2xl">
          Set ADMIN_PASSWORD to at least 12 characters in the environment. No default password is shipped.
        </p>
      </article>
    );
  }

  const allowed = await isAdmin();

  if (!allowed) {
    return (
      <article className="container py-8 pb-16">
        <h1>Admin sign in</h1>
        <form action={loginAdmin} className="mt-6 grid max-w-sm gap-3">
          <label className="grid gap-1 font-bold">
            Password
            <input className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" type="password" name="password" autoComplete="current-password" required />
          </label>
          <button className="button buttonPrimary" type="submit">
            Sign in
          </button>
        </form>
      </article>
    );
  }

  return (
    <div className="container py-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Admin">
          <ul className="flex list-none flex-wrap gap-2 p-0">
            {links.map(([href, label]) => (
              <li key={href}>
                <Link className="inline-flex min-h-11 items-center rounded-full border border-line px-3 font-bold text-teal no-underline" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form action={logoutAdmin}>
          <button className="button buttonGhost" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
