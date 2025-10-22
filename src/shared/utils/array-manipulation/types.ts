
export type Replacer<
  T extends string,
  S extends string,
  D extends string,
  A extends string = ''> = T extends `${infer L}${S}${infer R}` ? Replacer<R, S, D, `${A}${L}${D}`> : `${A}${T}`

export type PathsToStringProps<T> = T extends string ? [] : {
  [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>]
}[Extract<keyof T, string>];

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
type DottablePaths<T, P extends Prev[number] = 10> = [] | ([P] extends [never] ? never :
  T extends readonly unknown[] ? never :
  T extends object ? {
    [K in ExtractDottable<keyof T>]: [K, ...DottablePaths<T[K], Prev[P]>]
  }[ExtractDottable<keyof T>] : never);

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type BadChars = '~' | '`' | '!' | '@' | '#' | '%' | '^' | '&' | '*' | '(' | ')' | '-' | '+'
  | '=' | '{' | '}' | ';' | ':' | '\'' | '"' | '<' | '>' | ',' | '.' | '/' | '?'
type ExtractDottable<K extends PropertyKey> =
  K extends string ? string extends K ? never :
  K extends `${Digit}${infer _}` | `${infer _}${BadChars}${infer _}` ? never :
  K
  : never


type Join<T extends string[], D extends string> =
  T extends [] ? never :
  T extends [infer F] ? F :
  T extends [infer F, ...infer R] ?
  F extends string ? string extends F ? string : `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;

type JoinNestedObjects<T> = Join<Extract<DottablePaths<T>, string[]>, '.'>;

type Pluralized<T> = `${string & keyof T}[s]`
export type PluralizedKeys<T> = string & keyof T | JoinNestedObjects<T> | Pluralized<T>

type PluralPicker<T, K> = {
  [key in Replacer<string & K, '[s]', 's'>]:
  key extends keyof T ? T[key] : key extends JoinNestedObjects<T> ? unknown : unknown[]
}

export type PickResult<T, K, I> = PluralPicker<T, K> & I
