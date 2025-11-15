import { accountGetAction } from '@/app/actions/accounts/account.actions';
import GridDashboardLayout from '@/app/components/layouts/Dashboard/Dashboard.layout';
import EntryBalance from '@/app/components/ui/EntryBalance/EntryBalance.ui';
import { EntriesProvider } from '@/app/providers/entries/EntriesProvider';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';

export default async function DashboardPageLayout(props: PageProps<'/dashboard/[uuid]'>) {
  const { uuid: accountUuid } = await props.params;
  const account = await accountGetAction({
    entries: {
      some: {
        account: { uuid: accountUuid }
      }
    }
  });

  if (!account.success) {
    return <div>Failed to load entries</div>;
  }

  return (
    <EntriesProvider entries={account.data.entries} accountUuid={account.data.uuid}>
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