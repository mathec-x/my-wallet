'use client';

import { ListContainer, ListItemInput, ListItemRow } from '@/app/components/elements';
import useLocalStorage, { STORAGE } from '@/app/hooks/useLocalStorage.hook';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import AddIcon from '@mui/icons-material/AddOutlined';
import BalanceIcon from '@mui/icons-material/Balance';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import UnlockIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/LockOutline';
import ShareIcon from '@mui/icons-material/Share';
import Chip from '@mui/material/Chip';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

export default function EntryBalance(props: { accountUuid: string }) {
	const [lock, setLock] = useLocalStorage(STORAGE.LOCK_BOARD, true);
	const { entries, balance, boards, board, setBoard } = useEntriesContext();
	const { handleBoardNameSubmit, handleCloneBoard, handleDeleteBoard, handleShareBoard } = useEntriesActions(props.accountUuid);
	const id = useId();

	return (
		<>
			{boards.length > 0 &&
				<Stack direction='row' spacing={1} alignItems='center' mb={1} overflow='auto' py={1}>
					<IconButton onClick={() => setLock(!lock)} color={lock ? 'primary' : 'secondary'}>
						{lock ? <LockIcon /> : <UnlockIcon />}
					</IconButton>
					<Grow in={!lock}>
						<div style={{ width: !lock ? 'auto' : 0, display: 'flex' }}>
							<IconButton onClick={() => handleShareBoard()} color='primary' disabled={!board?.id}>
								<ShareIcon />
							</IconButton>
							<IconButton onClick={() => handleCloneBoard()} color='primary' disabled={!board?.id}>
								<AddIcon />
							</IconButton>
						</div>
					</Grow>
					{boards.map((b, i) => (
						<Chip
							key={id + b.name + i}
							label={<Typography variant='subtitle2'>{b.name || '_______'}</Typography>}
							deleteIcon={<DeleteIcon sx={{ mx: 1 }} />}
							onDelete={!lock ? () => handleDeleteBoard(b.uuid) : undefined}
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