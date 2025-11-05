import { accountGetAction } from '@/app/actions/accounts/account.actions';
import { entriesListAction } from '@/app/actions/entries/entries.actions';
import { EntriesProvider } from '@/app/providers/entries/EntriesProvider';

export async function generateMetadata(props: LayoutProps<'/dashboard/[uuid]'>) {
  const response = await accountGetAction({
    where: {
      entries: {
        some: {
          account: {
            uuid: (await props.params).uuid
          }
        }
      }
    }
  });

  let title = 'Wallet - Dashboard';
  let description = 'Your wallet dashboard';
  if (response.success) {
    description = `Dashboard of account ${response.data.name}`;
    title = `${response.data.name} | ${description}`;
  }

  return { title, description };
}

export default async function DashboardPageLayout(props: LayoutProps<'/dashboard/[uuid]'>) {
  const { uuid: accountUuid } = await props.params;
  const entries = await entriesListAction({ accountUuid });

  if (!entries.success) {
    return <div>Failed to load entries</div>;
  }

  return (
    <EntriesProvider entries={entries.data} accountUuid={accountUuid}>
      {props.children}
    </EntriesProvider>
  );
}