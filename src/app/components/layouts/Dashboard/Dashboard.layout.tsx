'use client';

import { entriesCreateAction, entriesDeleteAction, entriesUpdateAction, Entry } from '@/app/actions/entries/entries.actions';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import EntryList from '@/app/components/ui/EntryList/EntryList.layout';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';

interface DashboardProps {
  accountUuid: string;
  entries: Entry[];
  entryUuid?: string;
  entrySearchParam: string;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [entries, setEntries] = useState(props.entries);

  const entry = useMemo(() => {
    return entries.find(e => e.uuid === props.entryUuid);
  }, [entries, props.entryUuid]);

  const handleSubmit = async (value: string, type: 'INCOME' | 'EXPENSE') => {
    setEntries([...entries, { title: value, type, uuid: '' } as Entry]); // Optimistic UI
    const entry = await entriesCreateAction({
      accountUuid: props.accountUuid,
      data: {
        title: value,
        type: type,
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

  const handleUpdate = async (data: EntryUpdateFormSchema) => {
    const res = await entriesUpdateAction({
      accountUuid: props!.accountUuid,
      entryUuid: entry!.uuid,
      data: {
        date: data.date ? new Date(data.date) : undefined,
        title: data.title,
        description: data.description,
        type: data.type as unknown as Entry['type'],
        amount: parseFloat(data.amount.replace('.', '').replace(',', '.')),
      }
    });
    if (res?.success) {
      setEntries(() => entries.map(entry => entry.uuid === res.data.uuid ? res.data : entry));
    } else {
      setEntries(entries);
    }
    return res;
  };

  return (
    <Grid container spacing={2} sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 6 }}>
        <EntryList
          editorModalName={props.entrySearchParam}
          accountUuid={props.accountUuid}
          entries={entries.filter(entry => entry.type === 'INCOME')}
          type='INCOME'
          onSumbit={handleSubmit}
          onDelete={handleDelete}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <EntryList
          editorModalName={props.entrySearchParam}
          accountUuid={props.accountUuid}
          entries={entries.filter(entry => entry.type === 'EXPENSE')}
          type='EXPENSE'
          onSumbit={handleSubmit}
          onDelete={handleDelete}
        />
      </Grid>
      <EntryForm
        editorModalName={props.entrySearchParam}
        entry={entry}
        onUpdate={handleUpdate}
      />
    </Grid>
  );
};

export default Dashboard;