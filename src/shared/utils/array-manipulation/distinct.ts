/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectByString } from './helpers';
import { PickResult, PluralizedKeys } from './types';

export function arrayDistinct<
  T extends Record<string, any>,
  S extends Partial<keyof T>,
  K extends PluralizedKeys<Partial<T>>,
  I extends Record<string, any>,
  R extends PickResult<T, K, I>>(array: T[], props: S | S[], select?: K[], defaults?: I): R[] {
  let key: string;
  let indexOfDot = -1;
  let indexOfArray = -1;
  const pushData: any = {};

  if (!select || select.length === 0) {
    select = Object.keys(array[0]) as K[];
  }

  if (!defaults) {
    defaults = {} as any;
  }

  for (let i = 0; i < array.length; ++i) {
    const elmnt = array[i];
    const array_unique_fk = props instanceof Array ? props.map(x => elmnt[x]).join('') : elmnt[props];
    pushData[array_unique_fk] ??= { ...defaults };

    for (let index = select.length - 1; index >= 0; --index) {
      const selectedIndex = select[index] as string;
      indexOfDot = selectedIndex.indexOf('.');
      indexOfArray = selectedIndex.indexOf('[s]');

      if (indexOfArray > -1) {
        key = selectedIndex.replace('[s]', 's');

        pushData[array_unique_fk][key] ??= [];

        const sinKey = selectedIndex.replace('[s]', '');
        if (pushData[array_unique_fk][key].indexOf(elmnt[sinKey]) === -1) {
          pushData[array_unique_fk][key].push(elmnt[sinKey]);
        }

      } else if (indexOfDot > -1) {
        key = selectedIndex;
        pushData[array_unique_fk][key] = ObjectByString(elmnt, key);
      } else {
        key = selectedIndex;
        pushData[array_unique_fk][key] = elmnt[key] || pushData[array_unique_fk][key] || null;
      }
    }
  }

  return Object.values(pushData);
}
