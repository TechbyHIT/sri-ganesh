import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { path?: unknown } | null;
  const path = typeof body?.path === "string" ? body.path : "";

  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  revalidatePath(path);
  return Response.json({ ok: true });
}
