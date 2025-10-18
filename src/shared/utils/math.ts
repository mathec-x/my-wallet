export function Sum<T>(arr: T[], Callback: keyof T | ((callable: T) => number)) {
  let t: number = 0;
  for (let i = arr.length - 1; i >= 0; --i) {
    const num: number = (typeof Callback !== 'function') ? Number(arr[i][Callback]) || 0 : Callback(arr[i]);
    t = t + num;
  }
  return t;
};