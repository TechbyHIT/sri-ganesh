import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="mb-5 flex list-none flex-wrap gap-2 p-0 text-sm text-muted [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline">
        {items.map((item, index) => {
          const last = index === items.length - 1;

          return (
            <li key={`${item.href}-${item.label}`}>
              {last ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {last ? null : <span aria-hidden="true"> / </span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
