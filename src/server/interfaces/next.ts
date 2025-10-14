import { ReadonlyURLSearchParams } from 'next/navigation';

export interface NextAsyncPageProps<P = unknown> {
  params: Promise<P>;
  searchParams: Promise<ReadonlyURLSearchParams>;
}
