'use client';

import { entriesUpdateAction, type Entry } from '@/app/actions/entries/entries.actions';
import ListItemAction from '@/app/components/elements/ListItemAction';
import ListItemCollapse from '@/app/components/elements/ListItemCollapse';
import ListItemRow from '@/app/components/elements/ListItemRow';
import useModalHandler from '@/app/hooks/useModalHandler';
import { categoriesList } from '@/shared/schemas/categoriesList';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { arrayGroupBy } from '@/shared/utils/array-manipulation/group-by';
import { floatToMoney } from '@/shared/utils/money-format';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAllOutlined';
import DoneIcon from '@mui/icons-material/DoneOutlined';
import InfoIcon from '@mui/icons-material/InfoOutline';
import Stack from '@mui/material/Stack';
import { useId, useMemo } from 'react';

interface EntryListProps {
	accountUuid: string;
	editorModalName: string;
	type: 'INCOME' | 'EXPENSE';
	entries: Entry[];
	groupBy?: keyof Entry;
	onSumbit: (value: string, type: 'INCOME' | 'EXPENSE') => Promise<void>;
	onDelete: (entry: Entry) => Promise<void>;
	onUpdate: (data: EntryUpdateFormSchema) => ReturnType<typeof entriesUpdateAction>;
}

export default function EntryList(props: EntryListProps) {
	const id = useId();
	const modal = useModalHandler(props.editorModalName);
	const group = useMemo(() => {
		if (!props.groupBy) {
			return [{
				category: null,
				data: props.entries,
				amount: props.entries.reduce((acc, cur) => acc + cur.amount, 0)
			}];
		}

		return arrayGroupBy(
			props.entries,
			[props.groupBy],
			(acc, cur) => ({
				category: acc.category || null,
				amount: cur.Sum(acc.amount, cur.amount),
				data: cur.ConcatArray(acc, cur.data)
			}));;

	}, [props.entries, props.groupBy]);

	return (
		<>
			{group
				.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
				.map(({ category, data, amount }, i) => {
					const { icon, label } = categoriesList[category as keyof typeof categoriesList] || { icon: null, label: null };

					return (
						<ListItemCollapse
							component='div'
							key={id + '-' + category + '-' + i}
							openValue={category || null}
							isOpenOn={(e) => e === category}
							icon={icon}
							primary={label ? `${label} (${data.length})` : null}
							secondary={`R$ ${floatToMoney(amount)}`}
							actionLabel={data.every(e => !e.future) && <DoneIcon color='disabled' />}
							disablePadding
						>
							{data.map((entry, i) => (
								<ListItemAction
									key={id + entry.title + entry.uuid + i}
									component="div"
									disablePadding={(props.groupBy && entry.category) ? false : true}
									SwipRightLabel={entry.future ? <DoneAllIcon color='success' /> : <DoneIcon color='info' />}
									onSwipeRight={() => props.onUpdate({ future: !entry.future, uuid: entry.uuid } as EntryUpdateFormSchema)}
									SwipLeftLabel={<DeleteIcon color='error' />}
									onSwipeLeft={() => props.onDelete(entry)}
									icon={entry.order}
									onClick={() => modal.open(entry.uuid)}
									primary={entry.title}
									secondary={`R$ ${floatToMoney(entry.amount)}`}
									caption={entry.description || entry.board?.name || ''}
									isLoading={!entry.uuid}
								>
									<Stack direction='row' spacing={1}>
										{/* {entry.category && <Chip label={entry.category} size='small' />} */}
										{entry.future ? null : <DoneAllIcon color='success' />}
									</Stack>
								</ListItemAction>
							))}
						</ListItemCollapse>
					);
				})}
			<ListItemRow
				component='div'
				hide={group[0]?.data?.length !== 1}
				avatarIcon={<InfoIcon color='disabled' />}
				caption='Deslize para a esquerda para deletar ou para a direita para marcar como resolvido.'
			/>
		</>
	);
}