import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import type { Prisma } from '@/server/infra/prisma/generated';
import 'server-only';

export interface EntriesCreateUseCaseParams {
	accountUuid: string;
	data: Omit<Prisma.EntryCreateInput, 'account'>;
}

export class EntriesCreateUseCase {
	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesCreateUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			const data = await prisma.entry.create({
				data: {
					...params.data,
					account: {
						connect: {
							uuid: params.accountUuid,
							user: {
								uuid: userUuid
							}
						}
					}
				},
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

			return ResponseService.Created(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
