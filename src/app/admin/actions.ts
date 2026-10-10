"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, adminToken, cookieName, tokensMatch } from "@/lib/security/admin";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!adminConfigured() || !tokensMatch(adminToken(password), adminToken(expected))) {
    redirect("/admin?error=1");
  }

  const jar = await cookies();
  jar.set(cookieName, adminToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(cookieName);
  redirect("/admin");
}
