/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from 'react';

export class EntryService<T> {
  constructor(
    private readonly entries: T[],
    private readonly setEntries: Dispatch<SetStateAction<T[]>>
  ) { }

  get items() {
    return this.entries;
  }

  board(idOrUudi: string | number) {
    const items = this.entries.filter((entry: any) => {
      if (typeof idOrUudi === 'number') {
        return entry.boardId === idOrUudi;
      }

      return entry.board.uuid === idOrUudi;
    });

    return new EntryService(items, this.setEntries);
  }

  filterBy(params: Partial<T>): T[] {
    return this.entries.filter((entry) => {
      return Object.keys(params).every((key) => {
        return entry[key as keyof T] === params[key as keyof T];
      });
    });
  }
}