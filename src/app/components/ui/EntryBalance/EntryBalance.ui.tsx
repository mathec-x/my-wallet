'use client';

import { type Entry, boardCreateAction, boardDeleteAction } from '@/app/actions/entries/entries.actions';
import { ListContainer, ListItemInput, ListItemRow } from '@/app/components/elements';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceOutlined';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function EntryBalance(props: { accountUuid: string }) {
	const { entries, balance, boards, set, board, setBoard } = useEntriesContext();

	const handleBoardNameSubmit = async (value: string) => {
		const res = await boardCreateAction({
			accountUuid: props.accountUuid,
			boardId: board?.id || 0,
			boardName: value,
			entriesIds: entries.map(e => e.id),
		});
		if (res.success) {
			res.data.entries.forEach(entry => {
				const board: Entry['board'] = { uuid: res.data.uuid, id: res.data.id, name: res.data.name };
				set((e) => e.id === entry.id, { board } as unknown as Entry);
			});
			setBoard({
				id: res.data.id,
				uuid: res.data.uuid,
				name: res.data.name,
			});

			return value;
		}

		alert('Erro ao criar o painel');
	};

	const handleDeleteBoard = async (boardUUid: string) => {
		entries.filter(e => e.board?.uuid === boardUUid).forEach(entry => {
			set((e) => e.id === entry.id, { board: undefined } as unknown as Entry);
		});
		setBoard(undefined);
		const res = await boardDeleteAction({ uuid: boardUUid });

		if (!res.success) {
			alert('Erro ao deletar o painel');
		}
	};

	return (
		<>
			{boards.length > 0 &&
				<Stack direction='row' spacing={1} alignItems='center' mb={1}>
					<Chip label={'add'} onClick={() => setBoard(board)} />
					{boards.map((b) => (
						<Chip key={b.name} label={b.name} onDelete={() => handleDeleteBoard(b.uuid)} onClick={() => setBoard(b)} />
					))}
				</Stack>
			}
			<ListItemInput
				hide={entries.length === 0}
				id='name-board'
				value={board?.name || ''}
				onSubmit={handleBoardNameSubmit}
				placeholder='Nomear este Painel'
			/>
			<ListContainer header={entries.length > 0 && balance.income !== '0,00' && 'resumo'}>
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
		</>
	);
}