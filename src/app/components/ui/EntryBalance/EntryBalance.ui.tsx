'use client';

import { boardCopyAction, boardCreateAction, boardDeleteAction } from '@/app/actions/entries/entries.actions';
import { ListContainer, ListItemInput, ListItemRow } from '@/app/components/elements';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/AddOutlined';
import BalanceIcon from '@mui/icons-material/Balance';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId, useState } from 'react';


export default function EntryBalance(props: { accountUuid: string }) {
	const { entries, balance, boards, board, setBoard, setEntriesBoard, addEntries, findEntries } = useEntriesContext();
	const [loading, setLoading] = useState(false);
	const id = useId();

	const handleBoardNameSubmit = async (value: string) => {
		const res = await boardCreateAction({
			accountUuid: props.accountUuid,
			boardId: board?.id || 0,
			boardName: value,
			entriesIds: entries.map(e => e.id),
		});
		if (res.success) {
			const entriesIds = entries.map(e => e.id);
			setEntriesBoard(entriesIds, {
				id: res.data.id,
				uuid: res.data.uuid,
				name: res.data.name,
			});
		} else {
			alert(res.message || 'Erro ao nomear o painel');
		}
	};

	const handleDeleteBoard = async (boardUUid: string) => {
		setLoading(true);
		const entriesIds = findEntries(e => e.board?.uuid === boardUUid).map(e => e.id);
		if (window.confirm([
			'Atenção! Esta ação não pode ser desfeita.',
			'Tem certeza que deseja deletar este painel?',
			`${entriesIds.length} entradas vinculadas a este painel serão deletadas.`
		].join('\n'))) {
			const res = await boardDeleteAction({ uuid: boardUUid });
			if (res.success) {
				setEntriesBoard(entriesIds);
			} else {
				alert(res.message || 'Erro ao deletar o painel');
			}
		}
		setLoading(false);
	};

	const cloneEmptyBoard = async () => {
		setLoading(true);
		const res = await boardCopyAction({
			accountUuid: props!.accountUuid,
			boardId: board!.id,
		});
		if (res.success) {
			addEntries(res.data);
			setBoard(res.data[0].board!);
		} else {
			alert(res.message || 'Erro ao clonar o painel');
		}
		setLoading(false);
	};
	return (
		<>
			{boards.length > 0 &&
				<Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1}>
					<IconButton onClick={() => cloneEmptyBoard()} color='primary' disabled={!board?.id} loading={loading}>
						<AddIcon />
					</IconButton>
					{boards.map((b, i) => (
						<Chip
							key={id + b.name + i}
							label={<Typography variant='subtitle2'>{b.name || '_______'}</Typography>}
							disabled={loading}
							deleteIcon={<DeleteIcon sx={{ ml: 1 }} />}
							onDelete={() => handleDeleteBoard(b.uuid)}
							onClick={() => setBoard(b)}
							color='primary'
							variant={board?.uuid === b.uuid ? 'filled' : 'outlined'}
						/>
					))}
				</Stack>
			}
			<ListItemInput
				id='name-board'
				hide={entries.length === 0 || !!board?.name}
				autoSelect
				sx={{ my: 2 }}
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
				{/* <ListItemRow
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
				</ListItemRow> */}
			</ListContainer>
		</>
	);
}