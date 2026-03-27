/**
 * ltp_change_24h is a ratio where 1.0 = no change, 1.02 = +2%, 0.98 = -2%.
 * Converts it to a signed percentage number (e.g. 2.34 or -1.50).
 */
export function parseChange24h(raw: string | null): number {
    return (parseFloat(raw ?? '1') - 1) * 100;
}
