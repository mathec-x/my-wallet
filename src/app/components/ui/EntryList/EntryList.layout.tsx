'use client';

import { type Entry } from '@/app/actions/entries/entries.actions';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemAction from '@/app/components/elements/ListItemAction';
import ListItemInput from '@/app/components/elements/ListItemInput';
import useModalHandler from '@/app/hooks/useModalHandler';
import moneyFormat from '@/shared/utils/money-format';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';

interface EntryListProps {
	accountUuid: string;
	editorModalName: string;
	entries: Entry[];
	type: 'INCOME' | 'EXPENSE';
	onSumbit: (value: string, type: 'INCOME' | 'EXPENSE') => Promise<void>;
	onDelete: (entry: Entry) => Promise<void>;
}

export default function EntryList({ entries, ...props }: EntryListProps) {
	const modal = useModalHandler(props.editorModalName);
	const title = props.type === 'INCOME' ? 'Entradas' : 'Saídas';
	return (
		<>
			<ListContainer header={title} disablePadding>
				<ListItemInput
					id={`input-add-entry-${props.type.toLowerCase()}`}
					onSubmit={(value) => props.onSumbit(value, props.type)}
					placeholder={`Adicionar título de ${title.substring(0, title.length - 1).toLowerCase()}`}
					onError={async () => {
						alert('Minimo 3 caracteres');
					}}
				/>
				{entries.map((entry) =>
					<ListItemAction
						key={entry.title + entry.uuid}
						dense
						divider
						disablePadding
						onClick={() => modal.open(entry.uuid)}
						primary={entry.title}
						secondary={moneyFormat(entry.amount)}
						caption={entry.description}
						isLoading={!entry.uuid}
					>
						<IconButton aria-label='delete entry' onClick={() => props.onDelete(entry)}>
							<DeleteIcon />
						</IconButton>
					</ListItemAction>
				)}
			</ListContainer>
		</>
	);
}