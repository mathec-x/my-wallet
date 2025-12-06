import { accountGetAction } from '@/app/actions/accounts/account.actions';
import { entriesListAction } from '@/app/actions/entries/entries.actions';
import GridDashboardLayout from '@/app/components/layouts/Dashboard/Dashboard.layout';
import EntryBalance from '@/app/components/ui/EntryBalance/EntryBalance.ui';
import { EntriesProvider } from '@/app/providers/entries/EntriesProvider';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: PageProps<'/dashboard/[uuid]'>) {
  const { uuid } = await props.params;
  const response = await accountGetAction({
    accountUuid: uuid
  });

  if (!response.success) {
    notFound();
  }

  return {
    title: response.data.name,
    description: `Dashboard of account ${response.data?.name}`
  };
}

export default async function DashboardPageLayout(props: PageProps<'/dashboard/[uuid]'>) {
  const { uuid: accountUuid } = await props.params;

  const entries = await entriesListAction({ accountUuid });
  if (!entries.success) {
    return <div>Failed to load entries</div>;
  }

  return (
    <EntriesProvider entries={entries.data} accountUuid={accountUuid}>
      <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
        <Grid size={{ xs: 12 }}>
          <EntryBalance accountUuid={accountUuid} />
        </Grid>
        <GridDashboardLayout
          listItemCollapseProps={{
            disablePadding: true,
            defaultOpen: true,
            divider: false,
            icon: <MoneyIcon />,
            avatarVariant: 'circular'
          }}
        />
      </Grid>
    </EntriesProvider>
  );
}