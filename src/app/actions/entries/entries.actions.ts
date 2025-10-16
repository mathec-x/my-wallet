'use server';

import { EntriesCreateUseCase, EntriesCreateUseCaseParams } from '@/server/application/useCases/entriesCreate/entriesCreate.useCase';
import { EntriesDeleteUseCase, EntriesDeleteUseCaseParams } from '@/server/application/useCases/entriesDelete/entriesDelete.useCase';
import { EntriesListUseCase, EntriesListUseCaseParams } from '@/server/application/useCases/entriesList/entriesList.useCase';
import { EntriesUpdateUseCase, EntriesUpdateUseCaseParams } from '@/server/application/useCases/entriesUpdate/entriesUpdate.useCase';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { ResponseServiceAsync } from '@/server/interfaces/next';

const cookieService = new CookieService();
const entriesListUseCase = new EntriesListUseCase(cookieService);
const entriesDeleteUseCase = new EntriesDeleteUseCase(cookieService);
const entriesUpdateUseCase = new EntriesUpdateUseCase(cookieService);
const entriesCreateUseCase = new EntriesCreateUseCase(cookieService);

export type Entry = ResponseServiceAsync<typeof entriesCreateAction>

export async function entriesCreateAction(params: EntriesCreateUseCaseParams) {
	return entriesCreateUseCase.execute(params);
}

export async function entriesListAction(params: EntriesListUseCaseParams) {
	return entriesListUseCase.execute(params);
};

export async function entriesDeleteAction(params: EntriesDeleteUseCaseParams) {
	return entriesDeleteUseCase.execute(params);
};

export async function entriesUpdateAction(params: EntriesUpdateUseCaseParams) {
	return entriesUpdateUseCase.execute(params);
};