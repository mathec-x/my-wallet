'use client';

import {
  entriesCreateAction, entriesDeleteAction, entriesUpdateAction
} from '@/app/actions/entries/entries.actions';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemCollapse from '@/app/components/elements/ListItemCollapse';
import ListItemInput from '@/app/components/elements/ListItemInput';

import EntryList from '@/app/components/ui/EntryList/EntryList.layout';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface GridDashboardLayoutProps {
  listItemCollapseProps?: Partial<React.ComponentProps<typeof ListItemCollapse>>;
}

const entrySearchParamDefault = 'entry';
const GridDashboardLayout: React.FC<GridDashboardLayoutProps> = (props) => {
  const { entries, addEntries, remove, restore, set, board, accountUuid, balance, findEntries } = useEntriesContext();

  const params = useSearchParams();
  const entryUuid = params.get(entrySearchParamDefault);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [entry] = useMemo(() => !entryUuid ? [] : findEntries(e => e.uuid === entryUuid), [entryUuid]);

  const incomes = useMemo(() => {
    return entries.filter(entry => entry.type === 'INCOME');
  }, [entries]);

  const expenses = useMemo(() => {
    return entries.filter(entry => entry.type === 'EXPENSE');
  }, [entries]);

  const handleSubmit = async (value: string, type: 'INCOME' | 'EXPENSE') => {
    const newEntry = await entriesCreateAction({
      accountUuid: accountUuid,
      data: {
        title: value,
        type: type,
        board: !board?.id ? undefined : {
          connect: { id: board.id }
        }
      }
    });
    addEntries(newEntry.success ? [newEntry.data] : undefined);
  };

  const handleDelete = async (param: { uuid: string }) => {
    remove({ uuid: param.uuid }); // Optimistic UI update
    const res = await entriesDeleteAction({ entryUuid: param.uuid, accountUuid: accountUuid });
    if (!res.success) {
      restore();
    }
  };

  const handleUpdate = useCallback(
    async (data: EntryUpdateFormSchema) => {
      const parsed = set((e) => e.uuid === (entry?.uuid || data.uuid), data); // Optimistic UI update
      const res = await entriesUpdateAction({
        accountUuid: accountUuid,
        entryUuid: data?.uuid || entry!.uuid,
        data: parsed as never,
      });
      if (res?.success) {
        set((e) => e.uuid === (entry?.uuid || data.uuid), res.data);
      } else {
        restore();
      }
      return res;
    }, [accountUuid, entry, restore, set]);

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer component='div'>
          <ListItemCollapse
            id="list-item-collapse-incomes"
            component='div'
            openValue='incomes'
            isOpenOn={(e) => e === 'incomes'}
            caption={'Entradas'}
            primary={`R$ ${balance.income}`}
            secondary={'Valor total'}
            hideExpandIcon={incomes.length === 0}
            actionLabel={![balance.income, '0,00'].includes(balance.futureIncome) && `R$ ${balance.futureIncome}`}
            {...props.listItemCollapseProps}
          >
            <EntryList
              editorModalName={entrySearchParamDefault}
              accountUuid={accountUuid}
              entries={incomes}
              type='INCOME'
              onSumbit={handleSubmit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </ListItemCollapse>
          <ListItemInput component='label'
            id={'input-add-entry-income'}
            icon={<></>}
            onSubmit={(value) => handleSubmit(value, 'INCOME')}
            placeholder={'Adicionar Entrada (título)'}
            onError={async () => { alert('Minimo 3 caracteres'); }} />
        </ListContainer>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer component='div'>
          <ListItemCollapse
            id="list-item-collapse-expenses"
            component='div'
            openValue='expenses'
            isOpenOn={(e) => e === 'expenses'}
            caption={'Saídas'}
            primary={`R$ ${balance.expense}`}
            secondary={'Valor total'}
            hideExpandIcon={expenses.length === 0}
            actionLabel={![balance.expense, '0,00'].includes(balance.futureExpense) && `R$ ${balance.futureExpense}`}
            {...props.listItemCollapseProps}
          >
            <EntryList
              editorModalName={entrySearchParamDefault}
              accountUuid={accountUuid}
              entries={expenses}
              groupBy='category'
              type='EXPENSE'
              onSumbit={handleSubmit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </ListItemCollapse>
          <ListItemInput component='label'
            id={'input-add-entry-expense'}
            icon={<></>}
            onSubmit={(value) => handleSubmit(value, 'EXPENSE')}
            placeholder={'Adicionar Saída (título)'}
            onError={async () => { alert('Minimo 3 caracteres'); }} />
        </ListContainer>
      </Grid>
      <EntryForm
        editorModalName={entrySearchParamDefault}
        entry={entry}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default GridDashboardLayout;