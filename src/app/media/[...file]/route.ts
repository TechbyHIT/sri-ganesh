import fs from "fs";
import path from "path";
import { uploadsDir } from "@/lib/store";

export const dynamic = "force-dynamic";

const types: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif" };

export async function GET(_request: Request, { params }: { params: Promise<{ file: string[] }> }) {
  const { file } = await params;
  const name = path.basename(file.join("/"));
  const type = types[path.extname(name).toLowerCase()];
  const full = path.join(uploadsDir(), name);
  if (!type || file.length !== 1 || !fs.existsSync(full)) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(full)), {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
  });
}
