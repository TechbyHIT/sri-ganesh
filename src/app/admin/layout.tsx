import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="container py-8">Loading admin</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
