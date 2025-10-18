'use client';

import { entriesUpdateAction, type Entry } from '@/app/actions/entries/entries.actions';
import ListItemAction from '@/app/components/elements/ListItemAction';
import ListItemInput from '@/app/components/elements/ListItemInput';
import useModalHandler from '@/app/hooks/useModalHandler';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { floatToMoney } from '@/shared/utils/money-format';
import AttachMoneyIcon from '@mui/icons-material/AttachMoneyOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAllOutlined';
import DoneIcon from '@mui/icons-material/DoneOutlined';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface EntryListProps {
	accountUuid: string;
	editorModalName: string;
	entries: Entry[];
	type: 'INCOME' | 'EXPENSE';
	onSumbit: (value: string, type: 'INCOME' | 'EXPENSE') => Promise<void>;
	onDelete: (entry: Entry) => Promise<void>;
	onUpdate: (data: EntryUpdateFormSchema) => ReturnType<typeof entriesUpdateAction>;
}

export default function EntryList({ entries, ...props }: EntryListProps) {
	const modal = useModalHandler(props.editorModalName);
	const title = props.type === 'INCOME' ? 'Entradas' : 'Saídas';
	return (
		<>
			<ListItemInput
				id={`input-add-entry-${props.type.toLowerCase()}`}
				icon={props.type === 'INCOME' ? <AttachMoneyIcon /> : <CurrencyExchangeIcon />}
				onSubmit={(value) => props.onSumbit(value, props.type)}
				placeholder={`Adicionar título de ${title.substring(0, title.length - 1).toLowerCase()}`}
				onError={async () => {
					alert('Minimo 3 caracteres');
				}}
			/>
			{entries
				.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				.map((entry) =>
					<ListItemAction
						key={entry.title + entry.uuid}
						dense
						divider
						disablePadding
						SwipRightLabel={entry.future ? <DoneAllIcon color='success' /> : <DoneIcon color='info' />}
						onSwipeRight={() => props.onUpdate({ future: !entry.future, uuid: entry.uuid } as unknown as EntryUpdateFormSchema)}
						SwipLeftLabel={<DeleteIcon color='error' />}
						onSwipeLeft={() => props.onDelete(entry)}
						icon={entry.order}
						onClick={() => modal.open(entry.uuid)}
						primary={entry.title}
						secondary={`R$ ${floatToMoney(entry.amount)}`}
						caption={entry.description}
						isLoading={!entry.uuid}
					>
						<Stack direction='row' spacing={1}>
							{entry.category && <Chip label={entry.category} size='small' />}
							{entry.future ? null : <DoneAllIcon />}
						</Stack>
						{/* <IconButton aria-label='delete entry' onClick={() => props.onDelete(entry)}>
							<DeleteIcon />
						</IconButton> */}
					</ListItemAction>
				)}
		</>
	);
}