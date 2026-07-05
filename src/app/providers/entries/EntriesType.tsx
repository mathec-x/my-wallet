import { entriesCreateAction } from '@/app/actions/entries/entries.actions';
import { ResponseServiceAsync } from '@/server/interfaces/next';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { Sum } from '@/shared/utils/math';
import { floatToMoney } from '@/shared/utils/money-format';

export type Entry = ResponseServiceAsync<typeof entriesCreateAction>
export type CustomFilterKeys = keyof Entry | `!${keyof Entry}`
export type ENTRY_TYPE = 'INCOME' | 'EXPENSE' | 'SAVING' | 'TASK'
export interface IEntriesContextType {
  entries: Entry[];
  entriesFilteredByProp: Entry[];
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
  const list = {
    income: entries.filter(e => e.type === 'INCOME'),
    expense: entries.filter(e => e.type === 'EXPENSE'),
    saving: entries.filter(e => !e.future && ['SAVING', 'TASK'].includes(e.type))
  };

  const saving = Sum(list.saving, 'amount');
  const income = Sum(list.income, 'amount');
  const expense = Sum(list.expense, 'amount');

  const futureIncome = Sum(entries.filter(e => e.future && e.type === 'INCOME'), 'amount');
  const futureExpense = Sum(entries.filter(e => e.future && e.type === 'EXPENSE'), 'amount');

  const expectedIncome = Sum(entries.filter(e => e.type === 'INCOME'), 'expected');
  const expectedExpense = Sum(entries.filter(e => e.type === 'EXPENSE'), 'expected');

  return {
    /** - total de entradas. */
    income: floatToMoney(income),
    /** - total de entradas. */
    expense: floatToMoney(expense),
    /** - saldo atual (entradas - saídas) */
    balance: floatToMoney(income - expense - saving),
    /** - entradas que Faltam resolver. retorna null se 0*/
    futureToIncome: floatToMoney(futureIncome, true),
    /** - saídas que Faltam resolver. retorna null se 0 */
    futureToExpense: floatToMoney(futureExpense, true),
    /** - entradas fixas (que é marcado com expected no valor)*/
    expectedIncome: floatToMoney(expectedIncome, true),
    /** - saídas fixas (que é marcado com expected no valor)*/
    expectedExpense: floatToMoney(expectedExpense, true),
  };
};