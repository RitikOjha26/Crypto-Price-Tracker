/**
 * Format a numeric price string with the given decimal places.
 * Falls back to the raw value if parsing fails.
 */
export function formatPrice(value: string | number, decimals = 2): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return String(value);
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
