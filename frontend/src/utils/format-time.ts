const TIME_UNITS: { name: Intl.RelativeTimeFormatUnit; value: number }[] = [
  { name: 'second', value: 60 },
  { name: 'minute', value: 60 },
  { name: 'hour', value: 24 },
  { name: 'day', value: 7 },
  { name: 'week', value: 4.345 },
  { name: 'month', value: 12 },
  { name: 'year', value: Infinity },
];

/** e.g. "3 days ago", "just now" */
export function formatRelativeTime(dateString: string): string {
  const inputDate = new Date(dateString);
  if (Number.isNaN(inputDate.getTime())) {
    return dateString;
  }

  const now = new Date();
  const deltaSeconds = Math.round((inputDate.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  let currentValue = deltaSeconds;

  for (const unit of TIME_UNITS) {
    if (Math.abs(currentValue) < unit.value) {
      if (unit.name === 'second' && Math.abs(currentValue) < 10) {
        return 'just now';
      }
      return rtf.format(Math.round(currentValue), unit.name);
    }
    currentValue /= unit.value;
  }

  return rtf.format(Math.round(currentValue), 'year');
}
