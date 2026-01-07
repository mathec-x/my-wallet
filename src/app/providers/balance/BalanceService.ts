import { NumberFormat } from '@/shared/utils/money-format';

export class BalanceService<T> {
  constructor(
    private readonly entries: T[],
    private readonly setEntries: (entries: T[]) => void
  ) {
  }

  size() {
    return this.entries.length;
  }

  sort(prop: keyof T) {
    return this.entries
      .sort((a, b) =>
        typeof a[prop] === 'string' && typeof b[prop] === 'string'
          ? (a[prop] as unknown as string).localeCompare(b[prop] as unknown as string)
          : typeof a[prop] === 'number' && typeof b[prop] === 'number'
            ? a[prop] - b[prop]
            : 0
      );
  }

  search(callback: (e: T) => boolean) {
    return new BalanceService(this.entries.filter(callback), this.setEntries);
  }

  multiply(Callback: keyof T | ((callable: T) => number), value = 0) {
    let t: number = 0;
    for (let i = this.entries.length - 1; i >= 0; --i) {
      const num: number = (typeof Callback !== 'function') ? Number(this.entries[i][Callback]) || 0 : Callback(this.entries[i]);
      t = t + num;
    }
    return new NumberFormat(t * value);
  };
}