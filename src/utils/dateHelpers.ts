import { format, parseISO, isSameDay, startOfDay } from 'date-fns'

export function toDayKey(dateIso: string): string {
  return format(startOfDay(parseISO(dateIso)), 'yyyy-MM-dd')
}

export function formatDate(dateIso: string): string {
  return format(parseISO(dateIso), 'MMM d, yyyy')
}

export function formatDateTime(dateIso: string): string {
  return format(parseISO(dateIso), 'MMM d, yyyy · h:mm a')
}

export function formatTime(dateIso: string): string {
  return format(parseISO(dateIso), 'h:mm a')
}

export function isToday(dateIso: string): boolean {
  return isSameDay(parseISO(dateIso), new Date())
}
