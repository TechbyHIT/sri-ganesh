import { submitInquiry } from "@/lib/forms/submit-inquiry";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await submitInquiry(
    { ...(body ?? {}), kind: "contact" },
    request.headers.get("x-forwarded-for") ?? "local",
  );
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
