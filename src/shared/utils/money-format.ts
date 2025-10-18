
const intl = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function floatToMoney(value: number): string {
  return intl.format(value);
}
