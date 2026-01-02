'use client';

import { boardCopyAction, boardCreateAction, boardDeleteAction } from '@/app/actions/entries/entries.actions';
import { ListContainer, ListItemInput, ListItemRow } from '@/app/components/elements';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import { usePromptWindow } from '@/app/providers/prompt/PromptProvider';
import AddIcon from '@mui/icons-material/AddOutlined';
import BalanceIcon from '@mui/icons-material/Balance';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon from '@mui/icons-material/Share';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId } from 'react';


export default function EntryBalance(props: { accountUuid: string }) {
	const { confirm, alert, loading } = usePromptWindow();
	const { entries, balance, boards, board, setBoard, setEntriesBoard, addEntries, findEntries } = useEntriesContext();
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
			await alert(res.message || 'Erro ao nomear o painel');
		}
	};

	const handleDeleteBoard = async (boardUUid: string) => {
		const list = findEntries(e => e.board?.uuid === boardUUid);
		const confirmation = await confirm(
			'Atenção! Esta ação não pode ser desfeita.',
			`Tem certeza que deseja deletar o painel ${list[0].board?.name} com ${list.length} entradas vinculadas? essas entradas serão deletadas.`,
		);
		if (!confirmation) {
			return;
		}
		loading(true, 'Deletando painel...');
		const res = await boardDeleteAction({ uuid: boardUUid });
		if (res.success) {
			setEntriesBoard(list.map(e => e.id));
		} else {
			await alert(res.message || 'Erro ao deletar o painel');
		}
		loading(false);
	};

	const cloneBoard = async () => {
		const confirmation = await confirm(
			'Clonar painel',
			`Deseja clonar o painel '${board!.name || ''}' com todas as suas entradas?`,
		);
		if (!confirmation) {
			return;
		}
		loading(true, `Clonando painel '${board!.name || '...'}'`);
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
		loading(false);
	};

	const handleShareBoard = () => {
		alert('Em breve você poderá compartilhar seus painéis com outras pessoas!');
	};

	return (
		<>
			{boards.length > 0 &&
				<Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1}>
					<IconButton onClick={() => handleShareBoard()} color='primary' disabled={!board?.id}>
						<ShareIcon />
					</IconButton>
					<IconButton onClick={() => cloneBoard()} color='primary' disabled={!board?.id}>
						<AddIcon />
					</IconButton>
					{boards.map((b, i) => (
						<Chip
							key={id + b.name + i}
							label={<Typography variant='subtitle2'>{b.name || '_______'}</Typography>}
							deleteIcon={<DeleteIcon sx={{ mx: 1 }} />}
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