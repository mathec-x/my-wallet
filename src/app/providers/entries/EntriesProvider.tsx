'use client';

import { entriesCreateAction } from '@/app/actions/entries/entries.actions';
import { ResponseServiceAsync } from '@/server/interfaces/next';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { Sum } from '@/shared/utils/math';
import { floatToMoney, moneyToFloat } from '@/shared/utils/money-format';
import { createContext, useContext, useMemo, useState } from 'react';

export type Entry = ResponseServiceAsync<typeof entriesCreateAction>

function calculateBalance(entries: Entry[]) {
  const income = Sum(entries.filter(e => e.type === 'INCOME'), 'amount');
  const expense = Sum(entries.filter(e => e.type === 'EXPENSE'), 'amount');

  const futureIncome = Sum(entries.filter(e => !e.future && e.type === 'INCOME'), 'amount');
  const futureExpense = Sum(entries.filter(e => !e.future && e.type === 'EXPENSE'), 'amount');
  return {
    income: floatToMoney(income), // To receive
    expense: floatToMoney(expense), // To pay
    futureIncome: floatToMoney(futureIncome), // Received
    futureExpense: floatToMoney(futureExpense), // Received - To receive
    balance: floatToMoney(futureIncome - futureExpense), // Received - Paid
    futureBalance: floatToMoney(expense - futureExpense), // To receive - To pay
  };
};

interface EntriesContextType {
  entries: Entry[];
  restore: () => void;
  remove: (param: { uuid: string }) => void;
  set: (callback: (entry: Entry) => boolean, updatedEntry: EntryUpdateFormSchema | Entry) => Partial<Entry>;
  add: (data?: Partial<Entry>) => void;
  accountUuid: string;
  balance: ReturnType<typeof calculateBalance>;
  boards: {
    id: number;
    uuid: string;
    name: string;
  }[];
  board?: {
    id: number;
    uuid: string;
    name: string;
  }
  setBoard: (board?: { id: number; uuid: string; name: string }) => void;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

interface EntriesProviderProps {
  entries: Entry[];
  accountUuid: string;
}

export function EntriesProvider({ children, entries: values, ...props }: React.PropsWithChildren<EntriesProviderProps>) {
  const [entries, setEntries] = useState(() => values);

  const balance = useMemo(() => calculateBalance(entries), [entries]);
  const boards = useMemo(() => {
    const boards: EntriesContextType['boards'] = [];
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
    return boards;
  }, [entries]);

  const [board, setBoard] = useState(() => boards.length > 0 ? boards[boards.length - 1] : undefined);

  function remove(param: { uuid: string }) {
    setEntries(entries.filter(entry => entry.uuid !== param.uuid));
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
    return data;
  }

  function restore() {
    setEntries([...entries]);
  }

  function add(data?: Partial<Entry>) {
    if (data) {
      setEntries([...entries, data as Entry]);
    } else {
      restore();
    }
  }


  return (
    <EntriesContext.Provider value={{
      entries,
      remove,
      set,
      add,
      restore,
      balance,
      boards,
      board,
      setBoard,
      ...props
    }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntriesContext() {
  const context = useContext(EntriesContext);
  if (context === undefined) {
    throw new Error('useEntriesContext must be used within an EntriesProvider');
  }
  return context;
}