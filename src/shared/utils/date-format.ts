const intl = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function utcDateToString(date: Date): string {
  return intl.format(date);
}