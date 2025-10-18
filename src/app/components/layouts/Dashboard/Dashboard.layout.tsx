'use client';

import { entriesCreateAction, entriesDeleteAction, entriesUpdateAction, Entry } from '@/app/actions/entries/entries.actions';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemRow from '@/app/components/elements/ListItemRow';
import EntryList from '@/app/components/ui/EntryList/EntryList.layout';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { moneyToFloat } from '@/shared/utils/money-format';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';

interface DashboardLayoutProps {
  accountUuid: string;
  entries: Entry[];
  entryUuid?: string;
  entrySearchParam: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { entries, balance, ...context } = useEntriesContext();

  const entry = useMemo(() => {
    return entries.find(e => e.uuid === props.entryUuid);
  }, [entries, props.entryUuid]);

  const handleSubmit = async (value: string, type: 'INCOME' | 'EXPENSE') => {
    context.add({ title: value, type, uuid: '' }); // Optimistic UI update
    const entry = await entriesCreateAction({
      accountUuid: props.accountUuid,
      data: {
        title: value,
        type: type,
      }
    });
    context.add(entry.success ? entry.data : undefined);
  };

  const handleDelete = async (param: { uuid: string }) => {
    context.remove({ uuid: param.uuid }); // Optimistic UI update
    const res = await entriesDeleteAction({ entryUuid: param.uuid, accountUuid: props.accountUuid });
    if (!res.success) {
      context.restore();
    }
  };

  const handleUpdate = async (data: EntryUpdateFormSchema) => {
    context.set((e) => e.uuid === (entry?.uuid || data.uuid), data); // Optimistic UI update
    const res = await entriesUpdateAction({
      accountUuid: props!.accountUuid,
      entryUuid: data?.uuid || entry!.uuid,
      data: {
        ...data,
        amount: data.amount ? moneyToFloat(data.amount) : undefined,
      },
    });
    if (res?.success) {
      context.set((e) => e.uuid === (entry?.uuid || data.uuid), res.data);
    } else {
      context.restore();
    }
    return res;
  };

  return (
    <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12 }}>
        <ListContainer header={entries.length > 0 && 'resumo'}>
          <ListItemRow
            hide={balance.income === '0,00'}
            primary={<>Saldo R$ <Typography variant='body1' display='inline'>{balance.balance}</Typography></>}
            caption={<>Devedor R$ <Typography variant='body1' display='inline'>{balance.futureBalance}</Typography></>}
            avatarIcon={<AccountBalanceIcon />}
          >
          </ListItemRow>
          <ListItemRow
            hide={balance.income === '0,00'}
            primary={`Entradas R$ ${balance.income}`}
            caption={![balance.income, '0,00'].includes(balance.futureIncome) && `Recebido R$ ${balance.futureIncome}`}
            avatarIcon={<AccountBalanceIcon />}
          >
          </ListItemRow>
          <ListItemRow
            hide={balance.expense === '0,00'}
            primary={`Saídas R$ ${balance.expense}`}
            caption={![balance.expense, '0,00'].includes(balance.futureExpense) && `Pago R$ ${balance.futureExpense}`}
            avatarIcon={<AccountBalanceIcon />}
          >
          </ListItemRow>
        </ListContainer>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer header={'entradas'}>
          <EntryList
            editorModalName={props.entrySearchParam}
            accountUuid={props.accountUuid}
            entries={entries.filter(entry => entry.type === 'INCOME')}
            type='INCOME'
            onSumbit={handleSubmit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </ListContainer>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer header={'entradas'}>
          <EntryList
            editorModalName={props.entrySearchParam}
            accountUuid={props.accountUuid}
            entries={entries.filter(entry => entry.type === 'EXPENSE')}
            type='EXPENSE'
            onSumbit={handleSubmit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </ListContainer>
      </Grid>
      <EntryForm
        editorModalName={props.entrySearchParam}
        entry={entry}
        onUpdate={handleUpdate}
      />
    </Grid >
  );
};

export default DashboardLayout;