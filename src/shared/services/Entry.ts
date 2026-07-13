import type { Dispatch, SetStateAction } from 'react';

export class EntryService<T> {
  constructor(
    private readonly entries: T[],
    private readonly setEntries: Dispatch<SetStateAction<T[]>>
  ) { }

  get items() {
    return this.entries;
  }

  filterBy(params: Partial<T>): T[] {
    return this.entries.filter((entry) => {
      return Object.keys(params).every((key) => {
        return entry[key as keyof T] === params[key as keyof T];
      });
    });
  }
}