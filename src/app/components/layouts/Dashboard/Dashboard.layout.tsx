'use client';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import EntryList from '@/app/components/composites/EntryList/EntryList.layout';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemCollapse from '@/app/components/elements/ListItemCollapse';
import ListItemInput from '@/app/components/elements/ListItemInput';
import { MODALS } from '@/app/hooks/useModalHandler';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import type { Entry } from '@/app/providers/entries/EntriesType';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import TabAction from '../../elements/TabActions';

const listItemCollapseProps: Partial<React.ComponentProps<typeof ListItemCollapse>> = {
  disablePadding: true,
  defaultOpen: true,
  divider: false,
  icon: <MoneyIcon />,
  avatarVariant: 'circular'
};

const GridDashboardLayout: React.FC = () => {
  const params = useSearchParams();
  const entryUuid = params.get(MODALS.ENTRY_EDITOR);
  const { entries, accountUuid, balance, findEntries } = useEntriesContext();
  const [customFilter, setCustomFilter] = useState<keyof Entry | `!${keyof Entry}`>();
  const handleCustomFilter = useCallback((entry: Entry) => {
    if (customFilter && customFilter.startsWith('!')) {
      return entry[customFilter.substring(1) as keyof Entry] ? false : true;
    } else if (customFilter) {
      return entry[customFilter as keyof Entry] ? true : false;
    }
    return true;
  }, [customFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [entry] = useMemo(() => !entryUuid ? [] : findEntries(e => e.uuid === entryUuid), [entryUuid]);
  const { handleSubmit, handleDelete, handleUpdate } = useEntriesActions(entry);

  const incomes = useMemo(() => {
    return entries.filter(entry => entry.type === 'INCOME');
  }, [entries]);

  const expenses = useMemo(() => {
    return entries.filter(entry => entry.type === 'EXPENSE' && handleCustomFilter(entry)
    );
  }, [entries, handleCustomFilter]);

  return (
    <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
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
            {...listItemCollapseProps}
          >
            <EntryList
              accountUuid={accountUuid}
              entries={incomes}
              type='INCOME'
              onSumbit={handleSubmit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </ListItemCollapse>
          <ListItemInput component='label'
            hide={entries.length > 5}
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
            {...listItemCollapseProps}
          >
            <TabAction
              options={[
                { label: 'Tudo', onSelect: () => setCustomFilter(undefined) },
                { label: 'Pendentes', onSelect: () => setCustomFilter('future') },
                { label: 'Pagos', onSelect: () => setCustomFilter('!future') }
              ]}
            />
            <EntryList
              accountUuid={accountUuid}
              entries={expenses}
              groupBy={!customFilter ? 'category' : undefined}
              type='EXPENSE'
              onSumbit={handleSubmit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </ListItemCollapse>
          <ListItemInput component='label'
            hide={entries.length > 5}
            id={'input-add-entry-expense'}
            icon={<></>}
            onSubmit={(value) => handleSubmit(value, 'EXPENSE')}
            placeholder={'Adicionar Saída (título)'}
            onError={async () => { alert('Minimo 3 caracteres'); }} />
        </ListContainer>
      </Grid>
      <EntryForm entry={entry} onUpdate={handleUpdate} />
    </Grid>
  );
};

export default GridDashboardLayout;