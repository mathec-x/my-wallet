'use client';

import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { moneyToFloat } from '@/shared/utils/money-format';
import { createContext, useContext, useMemo, useState } from 'react';
import { calculateBalance, type Entry, type IEntriesContextType } from './EntriesType';

const EntriesContext = createContext<IEntriesContextType | undefined>(undefined);

interface EntriesProviderProps {
  entries: Entry[];
  accountUuid: string;
}

export function EntriesProvider({ children, entries: values, ...props }: React.PropsWithChildren<EntriesProviderProps>) {
  const [entries, setEntries] = useState(values);

  const boards = useMemo(() => {
    const boards: IEntriesContextType['boards'] = [];
    entries.forEach(entry => {
      const boardId = entry.board?.id;
      if (boardId && !boards.find(b => b.id === boardId)) {
        boards.push({
          id: boardId,
          uuid: entry.board!.uuid,
          name: entry.board!.name
        });
      }
    });
    return boards.sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [entries]);

  const [board, setBoard] = useState(() => boards.length > 0 ? boards[boards.length - 1] : undefined);

  const filteredEntries = useMemo(() => entries
    .sort((a, b) => (a?.order || 0) - (b?.order || 0))
    .filter(entry => !board?.id || entry.boardId === board?.id), [entries, board]);

  const balance = useMemo(() => calculateBalance(filteredEntries), [filteredEntries]);

  function remove(param: { uuid: string }) {
    const list = entries.filter(entry => entry.uuid !== param.uuid);
    setEntries(list);
    if (list.filter(e => e.boardId === board?.id).length === 0) {
      setBoard(list[list.length - 1]?.board || undefined);
    }
  }

  function setEntriesBoard(entriesIds: number[], board?: { id: number; uuid: string; name: string }) {
    const newList = entries
      // sets boards to entries
      .map(entry => !entriesIds.includes(entry.id)
        ? entry
        : {
          ...entry,
          boardId: board?.id || null,
          board: board ? { id: board.id, uuid: board.uuid, name: board.name } : null
        }
      )
      // or remove entries without board
      .filter(e => e.boardId !== null);

    setEntries(newList);
    if (!board && newList.length === 0) {
      setBoard(undefined);
    } else {
      setBoard(board ? board : newList[newList.length - 1].board!);
    }
  }

  function set(callback: (entry: Entry) => boolean, updatedEntry: EntryUpdateFormSchema | Entry) {
    const data: Partial<Entry> = {};
    if ('title' in updatedEntry) data.title = updatedEntry.title;
    if ('description' in updatedEntry) data.description = updatedEntry.description;
    if ('amount' in updatedEntry) data.amount = moneyToFloat(updatedEntry.amount);
    if ('expected' in updatedEntry) data.expected = moneyToFloat(updatedEntry?.expected || data.amount);
    if ('order' in updatedEntry) data.order = updatedEntry.order;
    if ('type' in updatedEntry) data.type = updatedEntry.type;
    if ('category' in updatedEntry) data.category = updatedEntry.category;
    if ('future' in updatedEntry) data.future = updatedEntry.future;
    if ('board' in updatedEntry) {
      data.boardId = updatedEntry.board?.id;
      data.board = updatedEntry.board;
    };

    setEntries(() => entries.map(entry => callback(entry) ? { ...entry, ...data } : entry));
    // if (data.board) {
    //   setBoard(data.board);
    // };
    return data;
  }

  function restore() {
    setEntries([...entries]);
  }

  function addEntries(data?: Partial<Entry>[]) {
    return (data) ? setEntries([...entries, ...data as Entry[]]) : restore();
  }

  return (
    <EntriesContext.Provider value={{
      entries: filteredEntries,
      remove,
      set,
      addEntries,
      restore,
      balance,
      boards,
      board,
      setBoard,
      setEntriesBoard,
      findEntries: (callback: (entry: Entry) => boolean) => entries.filter(callback),
      ...props
    }}>{children}</EntriesContext.Provider>
  );
}

export function useEntriesContext() {
  const context = useContext(EntriesContext);
  if (context === undefined) {
    throw new Error('useEntriesContext must be used within an EntriesProvider');
  }
  return context;
}
