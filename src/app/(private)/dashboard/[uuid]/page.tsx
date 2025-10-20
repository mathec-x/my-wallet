import Dashboard from '@/app/components/layouts/Dashboard/Dashboard.layout';
import { NextAsyncPageProps } from '@/server/interfaces/next';

export default async function DashboardPage(props: NextAsyncPageProps<{ uuid: string }, { entry: string }>) {
  const searchParamsProps = await props.searchParams;

  return (
    <Dashboard entrySearchParam='entry' entryUuid={searchParamsProps?.entry} />
  );
}