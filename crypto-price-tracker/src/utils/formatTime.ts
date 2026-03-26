/**
 * Format a Unix millisecond timestamp to HH:MM:SS.
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour12: false });
}
