'use server';

import { BoardCreateUseCase, type BoardCreateUseCaseParams } from '@/server/application/useCases/boardCreate/boardCreate.useCase';
import { BoardDeleteUseCase, type BoardDeleteUseCaseParams } from '@/server/application/useCases/boardDelete/boardDelete.useCase';
import { EntriesCreateUseCase, type EntriesCreateUseCaseParams } from '@/server/application/useCases/entriesCreate/entriesCreate.useCase';
import { EntriesDeleteUseCase, type EntriesDeleteUseCaseParams } from '@/server/application/useCases/entriesDelete/entriesDelete.useCase';
import { EntriesListUseCase, type EntriesListUseCaseParams } from '@/server/application/useCases/entriesList/entriesList.useCase';
import { EntriesUpdateUseCase, type EntriesUpdateUseCaseParams } from '@/server/application/useCases/entriesUpdate/entriesUpdate.useCase';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { ResponseServiceAsync } from '@/server/interfaces/next';

const cookieService = new CookieService();
const entriesListUseCase = new EntriesListUseCase(cookieService);
const entriesDeleteUseCase = new EntriesDeleteUseCase(cookieService);
const entriesUpdateUseCase = new EntriesUpdateUseCase(cookieService);
const entriesCreateUseCase = new EntriesCreateUseCase(cookieService);
const boardCreateUseCase = new BoardCreateUseCase(cookieService);
const boardDeleteUseCase = new BoardDeleteUseCase();

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

export async function boardCreateAction(params: BoardCreateUseCaseParams) {
	return boardCreateUseCase.execute(params);
};

export async function boardDeleteAction(params: BoardDeleteUseCaseParams) {
	return boardDeleteUseCase.execute(params);
};

