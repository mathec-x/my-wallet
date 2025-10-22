/* eslint-disable @typescript-eslint/no-explicit-any */
export const filterByProp = (
  propsToFilter: Record<string, any>,
  objectMatch: Record<string, any>) => Object.keys(propsToFilter).every((key) => objectMatch[key] === propsToFilter[key]);

export const ObjectByString = function (o: Record<string, any>, s: string) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};
