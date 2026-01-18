import { entriesCreateAction } from '@/app/actions/entries/entries.actions';
import { ResponseServiceAsync } from '@/server/interfaces/next';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { Sum } from '@/shared/utils/math';
import { floatToMoney } from '@/shared/utils/money-format';

export type Entry = ResponseServiceAsync<typeof entriesCreateAction>
export type CustomFilterKeys = keyof Entry | `!${keyof Entry}`
export interface IEntriesContextType {
  entries: Entry[];
  filterBy: (filter?: CustomFilterKeys) => void;
  filterVal?: CustomFilterKeys;
  restore: () => void;
  remove: (param: { uuid: string }) => void;
  set: (callback: (entry: Entry) => boolean, updatedEntry: EntryUpdateFormSchema | Entry) => Partial<Entry>;
  addEntries: (data?: Partial<Entry>[]) => void;
  accountUuid: string;
  size: number;
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
  setEntriesBoard: (entriesIds: number[], board?: {
    id: number;
    uuid: string;
    name: string;
  } | undefined) => void
  findEntries: (callback: (entry: Entry) => boolean) => Entry[];
}

export function calculateBalance(entries: Entry[]) {
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