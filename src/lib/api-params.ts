/**
 * Lê o parâmetro de query `limit` de forma segura.
 *
 * `Number("abc")` vira NaN e NaN explodiria no Prisma (`take: NaN`);
 * valores negativos/zerados ou gigantes também são aceitos hoje sem corte.
 * Aplica: fallback quando ausente/inválido + clamp em [1, max].
 */
export function readLimitParam(
  searchParams: URLSearchParams,
  fallback: number,
  max = 100,
): number {
  const raw = searchParams.get("limit");
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(1, Math.floor(parsed)));
}

/** Clamp defensivo para `take` do Prisma (defesa em profundidade nos services). */
export function clampTake(value: number | undefined, fallback: number, max = 200): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(1, Math.floor(value)));
}

/**
 * Lê o parâmetro de query `page` (1-based) de forma segura.
 * Ausente/inválido/zerado/negativo → fallback (1).
 */
export function readPageParam(searchParams: URLSearchParams, fallback = 1): number {
  const raw = searchParams.get("page");
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}
