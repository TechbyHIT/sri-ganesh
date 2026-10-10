"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { submitInquiry } from "@/lib/forms/submit-inquiry";

export async function submitQuote(
  _state: { message: string } | null,
  formData: FormData,
): Promise<{ message: string }> {
  const headerList = await headers();
  const result = await submitInquiry(
    {
      kind: "quote",
      name: formData.get("name"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp") || "",
      serviceSlug: formData.get("serviceSlug"),
      citySlug: formData.get("citySlug"),
      areaSlug: formData.get("areaSlug") || "",
      propertyType: formData.get("propertyType") || "",
      message: formData.get("message"),
      consent: formData.get("consent") === "on",
      companyWebsite: formData.get("companyWebsite") || "",
    },
    headerList.get("x-forwarded-for") ?? "local",
  );

  if (!result.ok) {
    return { message: result.message };
  }

  redirect("/thank-you");
}
