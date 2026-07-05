'use client';

import EntryList from '@/app/components/composites/EntryList/EntryList.layout';
import ListContainer from '@/app/components/elements/ListContainer';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import PaymentsIcon from '@mui/icons-material/Payments';
import Grid from '@mui/material/Grid';
import React, { useMemo } from 'react';
import { ListItemRow } from '../../elements';
import TabAction from '../../elements/TabActions';
// const listItemCollapseProps: Partial<React.ComponentProps<typeof ListItemCollapse>> = {
//   disablePadding: true,
//   defaultOpen: true,
//   divider: false,
//   icon: <MoneyIcon />,
//   avatarVariant: 'circular'
// };

const GridDashboardLayout = (props: React.PropsWithChildren) => {
  const { entriesFilteredByProp, accountUuid, balance, filterVal, filterBy, size } = useEntriesContext();

  const incomes = useMemo(() => {
    return entriesFilteredByProp.filter(entry => entry.type === 'INCOME');
  }, [entriesFilteredByProp]);

  const expenses = useMemo(() => {
    return entriesFilteredByProp.filter(entry => entry.type === 'EXPENSE');
  }, [entriesFilteredByProp]);


  return (
    <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 4 }}>
        {props.children}
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Grid container spacing={2}>
          <Grid size={12} sx={{ p: 1 }}>
            <TabAction
              hide={size <= 5}
              options={[
                { label: 'Tudo', onSelect: () => filterBy(), icon: <PaymentsIcon /> },
                { label: 'Pendentes', onSelect: () => filterBy('future'), icon: <CloseIcon /> },
                { label: 'Resolvidos', onSelect: () => filterBy('!future'), icon: <DoneAllIcon /> },
                { label: 'Recorrente', onSelect: () => filterBy('expected'), icon: <EventRepeatIcon /> },
                { label: 'Eventual', onSelect: () => filterBy('!expected'), icon: <LowPriorityIcon /> },
              ]}
            />
          </Grid>
          {incomes.length > 0 && (
            <Grid size={{ xs: 12, sm: expenses.length > 0 ? 6 : 12 }}>
              <ListContainer component='div'
                header="Entradas"
                headerAppend={balance.futureToIncome && (<>Falta: {balance.futureToIncome}</>)}>
                {/* <ListItemCollapse
                    component='div'
                    openValue='incomes'
                    icon={<MoneyOnIcon />}
                    isOpenOn={(e) => e === 'incomes'}
                    caption={'Entradas'}
                    primary={`R$ ${balance.futureIncome}`}
                    secondary={'Valor recebido'}
                    actionLabel={![balance.futureIncome, '0,00'].includes(balance.futureIncome) && `R$ ${balance.futureIncome}`}
                    {...listItemCollapseProps}
                  > */}
                <EntryList accountUuid={accountUuid} entries={incomes} type='INCOME' />
                {/* </ListItemCollapse> */}
              </ListContainer>
            </Grid>
          )}
          {expenses.length > 0 && (
            <Grid size={{ xs: 12, sm: incomes.length > 0 ? 6 : 12 }}>
              <ListContainer component='div'
                header="Saídas"
                headerAppend={balance.futureToExpense && <>Falta: {balance.futureToExpense}</>}>
                {/* <ListItemCollapse
                    component='div'
                    openValue='expenses'
                    icon={<MoneyOffIcon />}
                    isOpenOn={(e) => e === 'expenses'}
                    caption={'Saídas'}
                    primary={`R$ ${balance.futureExpense}`}
                    secondary={'Valor pago'}
                    actionLabel={![balance.expense, '0,00'].includes(balance.futureExpense) && `R$ ${balance.futureExpense}`}
                    {...listItemCollapseProps}
                  > */}
                <EntryList
                  accountUuid={accountUuid}
                  entries={expenses}
                  groupBy={!filterVal ? 'category' : undefined}
                  type='EXPENSE'
                />
                {/* </ListItemCollapse> */}
              </ListContainer>
            </Grid>
          )}
        </Grid>
        <Grid size={12} sx={{ position: { sm: 'fixed', xs: 'relative' }, right: 0, bottom: 2 }}>
          <ListItemRow
            component='div'
            hide={size > 5}
            avatarIcon={<InfoIcon color='disabled' />}
            caption='Deslize para a esquerda para deletar ou para a direita para marcar como resolvido.' />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridDashboardLayout;