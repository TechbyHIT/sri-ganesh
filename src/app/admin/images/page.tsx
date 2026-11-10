import { allServices } from "@/data/all-services";
import { geoDistricts } from "@/data/geo";
import { readStore } from "@/lib/store";
import { deleteImageAction, uploadImageAction } from "../actions";
import { AdminTitle, Button, Card, Field, FlashMessage, inputClass, type Flash } from "../ui";

export default async function AdminImages({ searchParams }: { searchParams: Promise<Flash> }) {
  const flash = await searchParams;
  const uploads = readStore("uploads");
  const services = allServices();
  return (
    <>
      <AdminTitle
        title="Images"
        text="Upload genuine installation photos only. Attach them to a mandal under Locations, or set one as the hero image of a single page under SEO pages. Alt text is required and is used on the page."
      />
      <FlashMessage flash={flash} />
      <Card title="Upload">
        <form action={uploadImageAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Image" hint="WebP, JPEG, PNG or AVIF, under 4 MB">
            <input type="file" name="file" accept="image/webp,image/jpeg,image/png,image/avif" required className={inputClass} />
          </Field>
          <Field label="Alt text" hint="what the photo shows">
            <input name="alt" required minLength={15} className={inputClass} placeholder="Invisible grill cables on a 3rd-floor balcony with a sea view" />
          </Field>
          <Field label="Service">
            <select name="service" className={inputClass}>
              {services.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}
            </select>
          </Field>
          <Field label="District" hint="where it was installed">
            <select name="place" className={inputClass}>
              <option value="">—</option>
              {geoDistricts.map((district) => <option key={district.slug} value={district.slug}>{district.name}</option>)}
            </select>
          </Field>
          <div className="md:col-span-2"><Button tone="gold">Upload</Button></div>
        </form>
      </Card>
      <Card title={`Library (${uploads.length})`}>
        {uploads.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {uploads.map((upload) => (
              <figure key={upload.id} className="rounded-xl border border-brand-100 p-2 text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/media/${upload.file}`} alt={upload.alt} className="h-36 w-full rounded-lg object-cover" loading="lazy" />
                <figcaption className="mt-2 space-y-1">
                  <p className="text-brand-900">{upload.alt}</p>
                  <p className="text-brand-800/60">{upload.service}{upload.place ? ` · ${upload.place}` : ""} · {upload.createdAt.slice(0, 10)}</p>
                  <p className="font-mono text-brand-800/60">/media/{upload.file}</p>
                </figcaption>
                <form action={deleteImageAction} className="mt-2">
                  <input type="hidden" name="id" value={upload.id} />
                  <Button tone="danger">Delete</Button>
                </form>
              </figure>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-800/70">No uploads yet. The site keeps using the built-in gallery until you add your own.</p>
        )}
      </Card>
    </>
  );
}
