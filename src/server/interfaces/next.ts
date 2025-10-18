import { ReadonlyURLSearchParams } from 'next/navigation';

export interface NextAsyncPageProps<P = unknown, Q = unknown> {
  params: Promise<P>;
  searchParams: Promise<ReadonlyURLSearchParams & Q>;
}

type ResponseServiceData<T> = T extends { data: infer U } ? U : never;
export type ResponseServiceAsync<T extends (...args: never) => unknown> = ResponseServiceData<Awaited<ReturnType<T>>>;

export type OmitByPrefix<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${string}` ? never : K]: T[K];
};