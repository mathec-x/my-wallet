'use client';

import { ListContainer, ListItemInput, ListItemRow } from '@/app/components/elements';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import BalanceIcon from '@mui/icons-material/Balance';
import Typography from '@mui/material/Typography';

export default function EntryBalance() {
	const { entries, balance, board } = useEntriesContext();
	const { handleBoardNameSubmit } = useEntriesActions();

	return (
		<>
			<ListItemInput
				id='name-board'
				hide={entries.length === 0 || !!board?.name}
				autoSelect
				sx={{ py: 2 }}
				component='div'
				value={board?.name || ''}
				onSubmit={handleBoardNameSubmit}
				placeholder='Nomear este Painel'
			/>
			<ListContainer header={entries.length > 0 && balance.income !== '0,00' && 'Balance'} disablePadding>
				<ListItemRow
					hide={balance.income === '0,00'}
					primary={<>R$ <Typography variant='body1' display='inline'>{balance.balance}</Typography></>}
					secondary={'Saldo total considerando entradas e saídas'}
					caption={<>Devedor R$ <Typography variant='body1' display='inline'>{balance.futureBalance}</Typography></>}
					avatarVariant='rounded'
					avatarIcon={<BalanceIcon />}
				>
				</ListItemRow>
			</ListContainer>
		</>
	);
}