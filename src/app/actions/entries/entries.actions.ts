'use server';

import { EntriesDeleteUseCase, EntriesDeleteUseCaseParams } from '@/server/application/useCases/entriesDelete/entriesDelete.useCase';
import { EntriesListUseCase, EntriesListUseCaseParams } from '@/server/application/useCases/entriesList/entriesList.useCase';
import { EntriesUpdateUseCase, EntriesUpdateUseCaseParams } from '@/server/application/useCases/entriesUpdate/entriesUpdate.useCase';

const entriesListUseCase = new EntriesListUseCase();
const entriesDeleteUseCase = new EntriesDeleteUseCase();
const entriesUpdateUseCase = new EntriesUpdateUseCase();

export async function entriesListAction(params: EntriesListUseCaseParams) {
	return entriesListUseCase.execute(params);
};

export async function entriesDeleteAction(params: EntriesDeleteUseCaseParams) {
	return entriesDeleteUseCase.execute(params);
};

export async function entriesUpdateAction(params: EntriesUpdateUseCaseParams) {
	return entriesUpdateUseCase.execute(params);
};