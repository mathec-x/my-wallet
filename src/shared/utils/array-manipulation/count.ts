import { filterByProp } from './helpers';

type Func<T> = { [P in keyof T]?: T[P] } | ((call: { [P in keyof T]?: T[P] }) => boolean)
type PickResult<T, Fn extends keyof T> = { _count: number } & Pick<T, Fn>

export function arrayCount<T, Fn extends keyof T | Func<T>>(arr: T[], KeyCall: keyof T | Func<T>): Fn extends keyof T ? PickResult<T, Fn>[] : number {
  if (typeof KeyCall === 'undefined') return arr.length as Fn extends keyof T ? PickResult<T, Fn>[] : number;

  const byObject = typeof KeyCall === 'object';
  const byString = typeof KeyCall === 'string';
  const byFunction = typeof KeyCall === 'function';

  const a = [];
  let b = 0;

  for (let i = arr.length - 1; i >= 0; --i) {
    const next = arr[i];

    if (byString) {
      const ix = a.findIndex(x => x[KeyCall] === next[KeyCall]);

      if (ix >= 0) {
        a[ix]._count++;
      } else {
        a.push({ [KeyCall]: next[KeyCall], _count: 1 });
      };
    }
    else if (byObject) {
      b = filterByProp(KeyCall, next as Record<string, unknown>) ? b + 1 : b + 0;
    }
    else if (byFunction) {
      b = KeyCall(next) ? b + 1 : b + 0;

    } else {
      throw Error('[Array.Count] T expect object|string|function args)');
    }

  }

  return (byObject || byFunction ? b : a) as Fn extends keyof T ? PickResult<T, Fn>[] : number;
}
