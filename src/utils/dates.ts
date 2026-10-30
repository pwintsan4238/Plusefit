/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Calendar helpers. Days are identified by an offset from today (0 = today, -1 = yesterday)
// and stored under a local YYYY-MM-DD key so saved data stays on the right date.

/** Range of days the food diary can show: the past week up to 3 days ahead */
export const MIN_DAY_OFFSET = -6;
export const MAX_DAY_OFFSET = 3;

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Local calendar date as YYYY-MM-DD (not UTC, so late-evening entries stay on the right day) */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function dateKeyForOffset(offset: number, today = new Date()): string {
  return toDateKey(addDays(today, offset));
}

/** "Today", "Yesterday", "Tomorrow", otherwise the weekday name */
export function dayLabel(offset: number, today = new Date()): string {
  if (offset === 0) return 'Today';
  if (offset === -1) return 'Yesterday';
  if (offset === 1) return 'Tomorrow';
  return addDays(today, offset).toLocaleDateString('en-US', { weekday: 'long' });
}

/** e.g. "Friday, Oct 30" */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

/** e.g. "Oct 30" */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Monday-to-Sunday week containing `date` */
export function weekOf(date: Date): Date[] {
  const mondayOffset = (date.getDay() + 6) % 7;
  const monday = addDays(date, -mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}
