
const intl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function moneyFormat(value: number): string {
  return intl.format(value);
}

export default moneyFormat;