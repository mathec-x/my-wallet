import { entriesListAction } from '@/app/actions/entries/entries.actions';
import Dashboard from '@/app/components/layouts/Dashboard/Dashboard.layout';
import { NextAsyncPageProps } from '@/server/interfaces/next';


const entrySearchParam = 'entry';
export default async function DashboardPage(props: NextAsyncPageProps<{ uuid: string }, { entry?: string }>) {
  const { uuid: accountUuid } = await props.params;
  const searchParamsProps = await props.searchParams;
  const entryUuid = searchParamsProps[entrySearchParam];

  const entries = await entriesListAction({ accountUuid });
  if (!entries.success) {
    return <div>Failed to load entries</div>;
  }

  return (
    <Dashboard
      accountUuid={accountUuid}
      entries={entries.data}
      entryUuid={entryUuid}
      entrySearchParam={entrySearchParam}
    />
  );
}