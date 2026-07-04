'use client';

import { ListContainer, ListItemAction, ListItemInput } from '@/app/components/elements';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/Add';
import MoneyOnIcon from '@mui/icons-material/AttachMoneyOutlined';
import BalanceIcon from '@mui/icons-material/Balance';
import MoneyOffIcon from '@mui/icons-material/MoneyOffCsredOutlined';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import EntryList from '../EntryList/EntryList.layout';

export default function EntryBalance() {
	const router = useRouter();
	const { balance, board, accountUuid, size, entries } = useEntriesContext();
	const { handleBoardNameSubmit, handleSubmit } = useEntriesActions();

	const tasks = useMemo(() => {
		return entries.filter(entry => entry.type === 'TASK');
	}, [entries]);

	const savings = useMemo(() => {
		return entries.filter(entry => entry.type === 'SAVING');
	}, [entries]);

	return (
		<>
			<ListItemInput
				id='name-board'
				enableGutters
				hide={size === 0 || !!board?.name}
				autoSelect
				iconVariant='rounded'
				component='div'
				value={board?.name || ''}
				onSubmit={handleBoardNameSubmit}
				placeholder='Nomear este Painel'
			/>
			<ListItemInput
				id='input-add-entry-income'
				enableGutters
				icon={<AddIcon />}
				component="div"
				// sx={{ zIndex: 2, bgcolor: e => e.palette.background.paper }}
				iconVariant='rounded'
				onSubmit={(value) => handleSubmit(value, 'TASK', (e) => router.push(`?entry=${e.uuid}`))}
				placeholder={'Adicionar item e ir para detalhes...'}
				onError={async () => { alert('Minimo 3 caracteres'); }}
			/>
			<ListContainer header={size > 0 && 'Balance'} disablePadding>
				<ListItemAction
					disablePadding
					avatarVariant='rounded'
					icon={<MoneyOnIcon />}
					hide={size < 1}
					onClick={() => { }}
					primary={(<Typography variant='body1'><small>R$</small> {balance.income}</Typography>)}
					caption={'Entradas'}
					secondary={balance.expectedIncome && `Valor esperado: ${balance.expectedIncome}`}
				/>
				<ListItemAction
					disablePadding
					avatarVariant='rounded'
					icon={<MoneyOffIcon />}
					hide={size < 1}
					onClick={() => { }}
					primary={(<Typography variant='body1'><small>R$</small> {balance.expense}</Typography>)}
					caption={'Saídas'}
					secondary={balance.expectedExpense && `Valor esperado: ${balance.expectedExpense}`}
				/>
				<ListItemAction
					disablePadding
					avatarVariant='rounded'
					icon={<BalanceIcon />}
					hide={size < 1}
					onClick={() => { }}
					primary={(<Typography variant='body1'><small>R$</small> {balance.balance}</Typography>)}
					caption={'Total'}
				/>
			</ListContainer>
			<ListContainer component='div' header="Poupança" disablePadding hide={savings.length === 0}>
				<EntryList accountUuid={accountUuid} entries={savings} type='SAVING' />
			</ListContainer>
			<ListContainer component='div' header="Tarefas" disablePadding hide={tasks.length === 0}>
				<EntryList accountUuid={accountUuid} entries={tasks} type='TASK' />
			</ListContainer>
		</>
	);
}