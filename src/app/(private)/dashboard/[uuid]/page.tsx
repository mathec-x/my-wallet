import { entriesListAction } from '@/app/actions/entries/entries.actions';
import EntryForm from '@/app/components/composites/EntryForm/EntryForm';
import EntryList from '@/app/components/layouts/EntryList/EntryList.layout';
import { NextAsyncPageProps } from '@/server/interfaces/next';
import Grid from '@mui/material/Grid';

export default async function DashboardPage(props: NextAsyncPageProps<{ uuid: string }, { entry?: string }>) {
  const { uuid: accountUuid } = await props.params;
  const { entry: entryUuid } = await props.searchParams;

  const entries = await entriesListAction({ accountUuid });
  if (!entries.success) {
    return <div>Failed to load entries</div>;
  }

  return (
    <Grid container spacing={2} sx={{ mt: 1 }} height='calc(100vh - 100px)'>
      <Grid size={{ xs: 12, sm: 6 }}>
        <EntryList
          accountUuid={accountUuid}
          entries={entries.data.filter(entry => entry.type === 'INCOME')}
          type='INCOME'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <EntryList
          accountUuid={accountUuid}
          entries={entries.data.filter(entry => entry.type === 'EXPENSE')}
          type='EXPENSE'
        />
      </Grid>
      <EntryForm entry={entries.data.find(entry => entry.uuid === entryUuid)} />
    </Grid>
  );
}