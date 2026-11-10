export function adminEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 10);
}

function safeEqual(left: string, right: string) {
  let diff = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return diff === 0;
}

export function adminCredentialsMatch(header: string | null) {
  if (!adminEnabled() || !header?.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const split = decoded.indexOf(":");
  if (split < 0) return false;
  const user = decoded.slice(0, split);
  const password = decoded.slice(split + 1);
  return safeEqual(user, process.env.ADMIN_USER || "admin") && safeEqual(password, process.env.ADMIN_PASSWORD || "");
}
