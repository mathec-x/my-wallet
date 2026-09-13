import type { CategoryValue } from '@/shared/schemas/categoriesList';
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

  groupAndMean(prop: keyof T, groupBy: keyof T) {
    if (this.entries.length === 0) return new NumberFormat(0);

    const grouped = this.entries.reduce((acc, entry) => {
      const key = String(entry[groupBy]);
      acc[key] ??= [];
      acc[key].push(entry);

      return acc;
    }, {} as Record<string, T[]>);
    const sums = Object.values(grouped).map(group => group.reduce((acc, entry) => acc + (Number(entry[prop]) || 0), 0));
    const boardsLen = Object.values(grouped).length;
    const value = sums.reduce((acc, sum) => acc + sum, 0) / boardsLen;
    return new NumberFormat(value);
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

  expenses() {
    return this.search((e) => (e as { type: string }).type === 'EXPENSE');
  }

  incomes() {
    return this.search((e) => (e as { type: string }).type === 'INCOME');
  }

  savings() {
    return this.search((e) => (e as { type: string }).type === 'SAVING');
  }

  categoryIn(category: CategoryValue[]) {
    return this.search((e) => category.includes((e as { category: CategoryValue }).category));
  }

  categoryNotIn(category: CategoryValue[]) {
    return this.search((e) => !category.includes((e as { category: CategoryValue }).category));
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