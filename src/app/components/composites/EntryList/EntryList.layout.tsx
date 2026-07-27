'use client';

import { type Entry } from '@/app/actions/entries/entries.actions';
import ListItemAction from '@/app/components/elements/ListItemAction';
import ListItemCollapse from '@/app/components/elements/ListItemCollapse';
import useModalHandler, { MODALS } from '@/app/hooks/useModalHandler';
import { useEntriesActions } from '@/app/providers/entries/EntriesActions';
import { type ENTRY_TYPE } from '@/app/providers/entries/EntriesType';
import { categoriesList } from '@/shared/schemas/categoriesList';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import { arrayGroupBy } from '@/shared/utils/array-manipulation/group-by';
import { Sum } from '@/shared/utils/math';
import { floatToMoney } from '@/shared/utils/money-format';
import { parseArrayLimit } from '@/shared/utils/parse-limit';
import MoneyOnIcon from '@mui/icons-material/AttachMoneyOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAllOutlined';
import DoneIcon from '@mui/icons-material/DoneOutlined';
import MoneyOffIcon from '@mui/icons-material/MoneyOffCsredOutlined';
import TaskIcon from '@mui/icons-material/PlayArrow';
import SavingsIcon from '@mui/icons-material/SavingsOutlined';
import { Checkbox, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { useId, useMemo, useState } from 'react';

interface EntryListProps {
	accountUuid: string;
	type: ENTRY_TYPE;
	entries: Entry[];
	displayHint?: boolean;
	groupBy?: keyof Entry;
}

export default function EntryList(props: EntryListProps) {
	const [holders, setHolders] = useState<{ id: string; value: number }[]>([]);
	const { handleDelete, handleUpdate } = useEntriesActions();
	const id = useId();
	const modal = useModalHandler(MODALS.ENTRY_EDITOR);
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

	const iconHandler = (entry: Entry) => {
		if (holders.length > 0) {
			return (
				<Checkbox color='info'
					checked={holders.some(item => item.id === entry.uuid)}
					onChange={() => clickHandler(entry)} />);
		}


		if (entry.order) {
			return entry.order;
		}

		return entry.type === 'SAVING' ? <SavingsIcon />
			: entry.type === 'INCOME' ? <MoneyOnIcon />
				: entry.type === 'EXPENSE' ? <MoneyOffIcon />
					: <TaskIcon />;
	};

	const clickHandler = (entry: Entry) => {
		if (holders.length > 0) {
			setHolders((prev) => prev.some(item => item.id === entry.uuid)
				? prev.filter(item => item.id !== entry.uuid)
				: [...prev, { id: entry.uuid, value: entry.amount }]
			);
			return;
		}

		modal.open(entry.uuid);
	};

	const holdHandlers = (entry: Entry) => {
		return (holders.length > 0)
			? setHolders([])
			: setHolders((prev) => [...prev, { id: entry.uuid, value: entry.amount }]);
	};

	return (
		<>
			<Snackbar open={holders.length > 0} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
				<Alert
					onClick={() => setHolders([])}
					severity="info"
					variant="standard"
					sx={{ width: '100%' }}>
					Total R$ {floatToMoney(Sum(holders, 'value'))}
				</Alert>
			</Snackbar>
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
							caption={parseArrayLimit(data, 'title')}
							primary={label ? `${label} (${data.length})` : null}
							secondary={`R$ ${floatToMoney(amount)}`}
							actionLabel={data.every(e => !e.future) && <DoneIcon color='disabled' />}
							disablePadding
							divider={false}
							avatarVariant='default'
						>
							{data.map((entry, i) => {
								const entryRef = props.entries.find(e => e.id === entry.refCreditCardId);
								const entriesRef = props.entries.filter(e => e.refCreditCardId === entry.id);

								return (
									<ListItemAction
										key={id + entry.title + entry.uuid + i}
										component="div"
										dense
										divider={i === data.length - 1}
										disablePadding={(props.groupBy && entry.category) ? false : true}
										SwipRightLabel={entry.future ? <DoneAllIcon color='success' /> : <DoneIcon color='info' />}
										onSwipeRight={() => handleUpdate({ future: !entry.future, uuid: entry.uuid } as EntryUpdateFormSchema)}
										SwipLeftLabel={<DeleteIcon color='error' />}
										onHold={() => holdHandlers(entry)}
										onSwipeLeft={() => handleDelete(entry)}
										icon={iconHandler(entry)}
										onClick={() => clickHandler(entry)}
										primary={entry.title}
										avatarVariant='primary'
										secondary={entry.amount ? `R$ ${floatToMoney(entry.amount)}` : ''}
										caption={entry.description}
										isLoading={!entry.uuid}
									>
										<Stack direction='row' spacing={1} alignItems="center">
											{!props.groupBy &&
												<Typography variant='caption' color='textDisabled'>
													{categoriesList[entry.category as keyof typeof categoriesList]?.label}
												</Typography>
											}
											{entryRef?.title && <Typography variant='caption' color='textDisabled'>({entryRef.title})</Typography>}
											{entriesRef?.length > 0 && (
												<Typography variant='caption' color='textDisabled'>
													+ {floatToMoney(Sum(entriesRef, 'amount'))}
												</Typography>
											)}
											{entry.future ? null : <DoneAllIcon color='success' />}
										</Stack>
									</ListItemAction>
								);
							})}
						</ListItemCollapse >
					);
				})}
		</>
	);
}