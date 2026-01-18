'use client';

import { ListContainer, ListItemAction, ListItemInput } from '@/app/components/elements';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/Add';
import BalanceIcon from '@mui/icons-material/Balance';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import TabAction from '../../elements/TabActions';

export default function EntryBalance() {
	const router = useRouter();
	const { balance, board, accountUuid, filterBy, size } = useEntriesContext();
	const { handleBoardNameSubmit, handleSubmit } = useEntriesActions();

	return (
		<>
			<ListItemInput
				id='name-board'
				hide={size === 0 || !!board?.name}
				autoSelect
				sx={{ py: 2 }}
				component='div'
				value={board?.name || ''}
				onSubmit={handleBoardNameSubmit}
				placeholder='Nomear este Painel'
			/>
			<ListContainer header={size > 0 && 'Balance'} disablePadding>
				<ListItemAction
					disablePadding
					hide={size < 1}
					onClick={() => {
						router.push(`/calculate?accountUuid=${accountUuid}`);
					}}
					primary={<>R$ <Typography variant='body1' display='inline'>{balance.balance}</Typography></>}
					secondary={'Saldo total considerando entradas e saídas'}
					caption={<>Devedor R$ <Typography variant='body1' display='inline'>{balance.futureBalance}</Typography></>}
					avatarVariant='rounded'
					icon={<BalanceIcon />}
				/>
				<ListItemInput
					hide={size <= 5}
					id={'input-add-entry-income'}
					icon={<AddIcon />}
					sx={{ zIndex: 2, bgcolor: e => e.palette.background.paper }}
					iconVariant='rounded'
					onSubmit={(value) => handleSubmit(value, 'INCOME', (e) => router.push(`?entry=${e.uuid}`))}
					placeholder={'Adicionar item e ir para detalhes...'}
					onError={async () => { alert('Minimo 3 caracteres'); }} />
			</ListContainer>
			<TabAction
				hide={size <= 5}
				options={[
					{ label: 'Tudo', onSelect: () => filterBy() },
					{ label: 'Pendentes', onSelect: () => filterBy('future') },
					{ label: 'Pagos', onSelect: () => filterBy('!future') }
				]}
			/>
		</>
	);
}