import { entriesListAction } from '@/app/actions/entries/entries.actions';
import BalanceForm from '@/app/components/composites/BalanceForm/BalanceForm';
import { BalanceProvider } from '@/app/providers/balance/BalanceProvider';
import { redirect } from 'next/navigation';

export default async function CalculatePage(props: PageProps<'/calculate'>) {
  const { accountUuid } = await props.searchParams;
  if (!accountUuid) { redirect('/menu'); }

  const response = await entriesListAction({ accountUuid: accountUuid.toString() });
  if (!response.success) { redirect('/menu'); }

  return (
    <BalanceProvider values={response.data}>
      <BalanceForm />
    </BalanceProvider>
  );
}
