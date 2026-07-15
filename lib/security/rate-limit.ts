const windows = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 6, windowMs = 60_000) {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  current.count += 1;
  if (windows.size > 1_000) {
    for (const [id, entry] of windows) if (entry.resetAt <= now) windows.delete(id);
  }
  return { allowed: current.count <= limit, remaining: Math.max(0, limit - current.count) };
}
