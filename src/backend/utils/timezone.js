/**
 * Timezone utilities - UTC+8 (Malaysia Time)
 */

const UTC_OFFSET_HOURS = 8;

/**
 * Get current date in UTC+8
 */
export function getNowUTC8() {
    const now = new Date();
    return new Date(now.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
}

/**
 * Get today's date string in UTC+8 (YYYY-MM-DD)
 */
export function getTodayUTC8() {
    const now = getNowUTC8();
    return now.toISOString().split('T')[0];
}

/**
 * Convert a date string (YYYY-MM-DD) to start of day in UTC+8
 * Returns UTC time that represents 00:00:00 in UTC+8
 */
export function toStartOfDayUTC8(dateString) {
    // Parse the date string as UTC+8 midnight
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date at midnight UTC, then subtract 8 hours to get UTC+8 midnight in UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    utcDate.setUTCHours(utcDate.getUTCHours() - UTC_OFFSET_HOURS);
    return utcDate;
}

/**
 * Convert a date string (YYYY-MM-DD) to end of day in UTC+8
 * Returns UTC time that represents 23:59:59.999 in UTC+8
 */
export function toEndOfDayUTC8(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    utcDate.setUTCHours(utcDate.getUTCHours() - UTC_OFFSET_HOURS);
    return utcDate;
}

/**
 * Convert a Date object to date string in UTC+8 (YYYY-MM-DD)
 */
export function formatDateUTC8(date) {
    const utc8Date = new Date(date.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
    return utc8Date.toISOString().split('T')[0];
}

/**
 * Convert a Date object to display string in UTC+8 (DD/MM/YYYY)
 */
export function formatDisplayDateUTC8(date) {
    const utc8Date = new Date(date.getTime() + (UTC_OFFSET_HOURS * 60 * 60 * 1000));
    const day = String(utc8Date.getUTCDate()).padStart(2, '0');
    const month = String(utc8Date.getUTCMonth() + 1).padStart(2, '0');
    const year = utc8Date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Get start of month in UTC+8 (returns UTC time)
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (1-12)
 */
export function toStartOfMonthUTC8(year, month) {
    // First day of month at 00:00:00 UTC+8
    const utcDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    utcDate.setUTCHours(utcDate.getUTCHours() - UTC_OFFSET_HOURS);
    return utcDate;
}

/**
 * Get end of month in UTC+8 (returns UTC time)
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (1-12)
 */
export function toEndOfMonthUTC8(year, month) {
    // Last day of month at 23:59:59.999 UTC+8
    // Get first day of next month, then subtract 1ms
    const utcDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    utcDate.setUTCHours(utcDate.getUTCHours() - UTC_OFFSET_HOURS);
    utcDate.setTime(utcDate.getTime() - 1);
    return utcDate;
}

/**
 * Get current month in UTC+8 as YYYY-MM string
 */
export function getCurrentMonthUTC8() {
    const now = getNowUTC8();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}