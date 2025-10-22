/* eslint-disable @typescript-eslint/no-explicit-any */

type GroupByKey<T> = Partial<keyof T>[] | ((item: T) => string | number);
function getKey<T, I extends T>(keyOrFn: GroupByKey<T>, item: I): keyof T | string {
  if (typeof keyOrFn === 'function') {
    return String(keyOrFn(item));
  }
  let res = '';
  for (const iterator of keyOrFn) res += item[iterator];
  return res;
}


class GroupByInstance<T> {
  constructor(params: T) {
    Object.assign(this, params);
  }
  Has(a: keyof T) {
    return !!(this as any)?.[a];
  }
  IsTrue(a: unknown, b = undefined) {
    return !b ? a : false;
  }
  ConcatArray<V>(a: V | undefined = undefined, b: any[] | undefined = undefined): V[] {
    return !b ? (a ? [a] : []) : b.concat(a);
  }
  AorB<V>(a: V, b?: V): V | undefined {
    if (a && a instanceof Object) {
      for (const k in a) {
        if (Object.prototype.hasOwnProperty.call(a, k)) {
          if (!(a as any)?.[k]) { return b || {} as any; }
        }
      }
    }
    return a || b;
  }
  Max(a = 0, b = 0) {
    return Number(a) > Number(b) ? Number(a) : Number(b);
  }
  Min(a: number, b = a) {
    return Number(a) <= Number(b) ? Number(a) : Number(b);
  }
  Sum(a = 0, b = 0) {
    return Number(a) + Number(b);
  }
}

type NewInstance<T> = GroupByInstance<T> & { [P in keyof T]: T[P] }

export function arrayGroupBy<T, R>(
  array: T[],
  keys: GroupByKey<T>,
  reducer: <N extends NewInstance<any>>(previous: T, next: N) => R): R[] {
  return Object.values(
    array.reduce((acc: any, cur) => {
      const groupKey = getKey(keys, cur);
      const helpers = new GroupByInstance(acc[groupKey]);
      acc[groupKey] = reducer(cur, helpers);
      return acc;
    }, {})
  );
}