import { accountGetAction } from '@/app/actions/accounts/account.actions';
import { entriesListAction } from '@/app/actions/entries/entries.actions';
import BalanceForm from '@/app/components/composites/BalanceForm/BalanceForm';
import BoardsChip from '@/app/components/composites/BoardsChip/BoardsChip';
import EntryBalance from '@/app/components/composites/EntryBalance/EntryBalance.ui';
import GridDashboardLayout from '@/app/components/layouts/Dashboard/Dashboard.layout';
import { EntriesProvider } from '@/app/providers/entries/EntriesProvider';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
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
      <Toolbar>
        <BoardsChip />
      </Toolbar>
      <EntryBalance />
      <BalanceForm />
      <Grid container spacing={2} alignContent='flex-start' sx={{ mt: 1 }} height='calc(100vh - 100px)'>
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