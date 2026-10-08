/** Data de corte "há N dias". Fora do render para respeitar react-hooks/purity. */
export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
