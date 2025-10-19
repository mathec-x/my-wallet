import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import type { Prisma } from '@/server/infra/prisma/generated';
import 'server-only';

export interface EntriesUpdateUseCaseParams {
	accountUuid: string;
	entryUuid: string;
	data: Omit<Prisma.EntryUpdateInput, 'account' | 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
}

export class EntriesUpdateUseCase {
	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesUpdateUseCaseParams) {
		try {
			console.log('EntriesUpdateUseCase.execute', params);
			const userUuid = await this.cookieService.getUUidFromCookie();
			const data = await prisma.entry.update({
				where: {
					uuid: params.entryUuid,
					account: {
						uuid: params.accountUuid,
						user: {
							uuid: userUuid
						}
					},
				},
				data: params.data,
				include: {
					board: {
						select: {
							id: true,
							uuid: true,
							name: true,
						}
					},
				}
			});

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
