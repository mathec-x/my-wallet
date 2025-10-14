import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import type { Prisma } from '@/server/infra/prisma/generated';
import 'server-only';

export interface EntriesUpdateUseCaseParams {
	accountUuid: string;
	entryUuid: string;
	data: Prisma.EntryUpdateInput;
}

export class EntriesUpdateUseCase {
	async execute(params: EntriesUpdateUseCaseParams) {
		try {
			const data = await prisma.entry.update({
				where: {
					uuid: params.entryUuid,
					account: {
						uuid: params.accountUuid,
					}
				},
				data: params.data
			});

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
