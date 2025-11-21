
const intl = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function floatToMoney(value: number = 0): string {
  return intl.format(value || 0);
}

export function moneyToFloat(value?: string | number) {
  if (typeof value === 'number') return value;

  value = value?.toString();
  if (!value) return undefined;
  const normalized = value.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized);
}
