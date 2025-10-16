'use client';

import { entriesCreateAction, entriesDeleteAction, type Entry } from '@/app/actions/entries/entries.actions';
import ListContainer from '@/app/components/elements/ListContainer';
import ListItemAction from '@/app/components/elements/ListItemAction';
import ListItemInput from '@/app/components/elements/ListItemInput';
import useModalHandler from '@/app/hooks/useModalHandler';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

interface EntryListProps {
	accountUuid: string;
	entries: Entry[];
	type: 'INCOME' | 'EXPENSE';
}

export default function EntryList(props: EntryListProps) {
	const [entries, setEntries] = useState(() => props.entries);
	const modal = useModalHandler('entry');

	const title = props.type === 'INCOME' ? 'Entradas' : 'Saídas';
	const handleSubmit = async (value: string) => {
		setEntries([...entries, { title: value, type: props.type, uuid: '' } as Entry]); // Optimistic UI
		const entry = await entriesCreateAction({
			accountUuid: props.accountUuid,
			data: {
				title: value,
				type: props.type,
			}
		});

		if (entry.success) {
			setEntries([...entries, entry.data]);
		} else {
			setEntries([...entries]);
		}
	};

	const handleDelete = async (param: { uuid: string }) => {
		setEntries(entries.map(entry => ({
			...entry,
			uuid: entry.uuid === param.uuid ? '' : entry.uuid
		})));
		const res = await entriesDeleteAction({ entryUuid: param.uuid, accountUuid: props.accountUuid });
		if (res?.success) {
			setEntries(entries.filter(entry => entry.uuid !== res.data.uuid));
		} else {
			setEntries(entries);
		}
	};

	return (
		<>
			<ListContainer header={title} disablePadding>
				<ListItemInput
					id={`input-add-entry-${props.type.toLowerCase()}`}
					onSubmit={handleSubmit}
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
						secondary={entry.type}
						isLoading={!entry.uuid}
					>
						<IconButton aria-label='delete entry' onClick={() => handleDelete(entry)}>
							<DeleteIcon />
						</IconButton>
					</ListItemAction>
				)}
			</ListContainer>
		</>
	);
}