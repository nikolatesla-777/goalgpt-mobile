import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const TIMEZONE = 'Europe/Istanbul';

/**
 * Format match timestamp to HH:mm (TSİ)
 * @param timestamp Unix timestamp in seconds or milliseconds
 */
export const formatMatchTime = (timestamp: number): string => {
  // Convert to milliseconds if seconds
  const tsMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;

  // Convert to Istanbul time
  const zonedDate = toZonedTime(tsMs, TIMEZONE);

  // Format as HH:mm
  return format(zonedDate, 'HH:mm');
};

/**
 * Format match date to DD.MM.YYYY (TSİ)
 * @param timestamp Unix timestamp in seconds or milliseconds
 */
export const formatMatchDate = (timestamp: number): string => {
  const tsMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const zonedDate = toZonedTime(tsMs, TIMEZONE);
  return format(zonedDate, 'dd.MM.yyyy');
};
