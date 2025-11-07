'use client';

import {
  entriesCreateAction, entriesDeleteAction, entriesUpdateAction
} from '@/app/actions/entries/entries.actions';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import ListContainer from '@/app/components/elements/ListContainer';
import EntryBalance from '@/app/components/ui/EntryBalance/EntryBalance.ui';
import EntryList from '@/app/components/ui/EntryList/EntryList.layout';
import { useEntriesContext } from '@/app/providers/entries/EntriesProvider';
import { EntryUpdateFormSchema } from '@/shared/schemas/entryUpdateForm';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';

interface DashboardLayoutProps {
  entryUuid?: string;
  entrySearchParam: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { entries, addEntries, remove, restore, set, board, accountUuid } = useEntriesContext();

  const entry = useMemo(() => {
    return entries.find(e => e.uuid === props.entryUuid);
  }, [entries, props.entryUuid]);

  const handleSubmit = async (value: string, type: 'INCOME' | 'EXPENSE') => {
    const newEntry = await entriesCreateAction({
      accountUuid: accountUuid,
      data: {
        title: value,
        type: type,
        board: !board?.id ? undefined : {
          connect: { id: board.id }
        }
      }
    });
    addEntries(newEntry.success ? [newEntry.data] : undefined);
  };

  const handleDelete = async (param: { uuid: string }) => {
    remove({ uuid: param.uuid }); // Optimistic UI update
    const res = await entriesDeleteAction({ entryUuid: param.uuid, accountUuid: accountUuid });
    if (!res.success) {
      restore();
    }
  };

  const handleUpdate = async (data: EntryUpdateFormSchema) => {
    const parsed = set((e) => e.uuid === (entry?.uuid || data.uuid), data); // Optimistic UI update
    const res = await entriesUpdateAction({
      accountUuid: accountUuid,
      entryUuid: data?.uuid || entry!.uuid,
      data: parsed as never,
    });
    if (res?.success) {
      set((e) => e.uuid === (entry?.uuid || data.uuid), res.data);
    } else {
      restore();
    }
    return res;
  };

  return (
    <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12 }}>
        <EntryBalance accountUuid={accountUuid} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer header={'entradas'}>
          <EntryList
            editorModalName={props.entrySearchParam}
            accountUuid={accountUuid}
            entries={entries.filter(entry => entry.type === 'INCOME')}
            type='INCOME'
            onSumbit={handleSubmit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </ListContainer>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ListContainer header={'saídas'}>
          <EntryList
            editorModalName={props.entrySearchParam}
            accountUuid={accountUuid}
            entries={entries.filter(entry => entry.type === 'EXPENSE')}
            groupBy='category'
            type='EXPENSE'
            onSumbit={handleSubmit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </ListContainer>
      </Grid>
      <EntryForm
        editorModalName={props.entrySearchParam}
        entry={entry}
        onUpdate={handleUpdate}
      />
    </Grid >
  );
};

export default DashboardLayout;