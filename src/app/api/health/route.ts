import { getPrisma } from "@/lib/prisma";

export async function GET() {
  const prisma = getPrisma();

  if (!prisma) {
    return Response.json({ ok: true, database: false });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, database: true });
  } catch {
    return Response.json({ ok: false, database: false }, { status: 503 });
  }
}
