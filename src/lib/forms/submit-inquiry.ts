import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/security/rate-limit";
import { inquirySchema } from "@/lib/validation/contact";

export async function submitInquiry(raw: unknown, ip: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = inquirySchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  if (parsed.data.companyWebsite) {
    return { ok: false, message: "That submission could not be accepted." };
  }

  if (!rateLimit(`${ip}:${parsed.data.kind}`)) {
    return { ok: false, message: "Too many messages were sent from this network. Wait and try again." };
  }

  const prisma = getPrisma();

  if (!prisma) {
    return {
      ok: false,
      message:
        "The database is not connected, so this message was not saved. It will be stored after PostgreSQL is configured.",
    };
  }

  await prisma.contactInquiry.create({
    data: {
      kind: parsed.data.kind,
      name: parsed.data.name,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      serviceSlug: parsed.data.serviceSlug,
      citySlug: parsed.data.citySlug,
      areaSlug: parsed.data.areaSlug,
      propertyType: parsed.data.propertyType,
      message: parsed.data.message,
      consent: true,
    },
  });

  return { ok: true };
}
