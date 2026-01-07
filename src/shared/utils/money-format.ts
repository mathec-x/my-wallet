
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

export class NumberFormat {
  private formatter: Intl.NumberFormat;

  constructor(
    private readonly value: number | string,
    private readonly locale = 'pt-BR',
    private readonly options: Intl.NumberFormatOptions = {
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) {
    this.formatter = new Intl.NumberFormat(this.locale, this.options);
  }

  toMoney() {
    const value = (typeof this.value === 'string') ? Number(this.value) : this.value;
    return this.formatter.format(value || 0);
  }

  toFloat() {
    if (typeof this.value === 'number') return this.value;

    const value = this.value?.toString();
    if (!value) return undefined;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  }


  static money(value: string | number) {
    return new NumberFormat(value).toMoney();
  }
}