import { ReadonlyURLSearchParams } from 'next/navigation';

export interface NextAsyncPageProps<P = unknown> {
  params: Promise<P>;
  searchParams: Promise<ReadonlyURLSearchParams>;
}

type ResponseServiceData<T> = T extends { data: infer U } ? U : never;
export type ResponseServiceAsync<T extends (...args: never) => unknown> = ResponseServiceData<Awaited<ReturnType<T>>>;
