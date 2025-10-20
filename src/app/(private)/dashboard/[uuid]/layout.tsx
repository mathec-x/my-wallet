import { entriesListAction } from '@/app/actions/entries/entries.actions';
import { EntriesProvider } from '@/app/providers/entries/EntriesProvider';

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