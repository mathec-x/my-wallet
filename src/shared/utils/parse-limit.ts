export const parseArrayLimit = <T>(arr: T[], key: keyof T, limit = 6) => {
  const items = arr.slice(0, limit).map(e => parseStringLimit(String(e[key])));

  return items.join(', ') + (arr.length > items.length ? '...' : '');
};


export const parseStringLimit = (str: string) => {
  const strings = str.split(' ');
  const [initial] = strings;
  const rest = strings.pop();

  if (initial === rest || !rest) {
    return initial.toLocaleLowerCase();
  }

  return initial.slice(0, 1).toLocaleLowerCase() + rest.toLocaleLowerCase();
};