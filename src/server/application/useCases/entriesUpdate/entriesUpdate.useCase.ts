import { LoggerService } from '@/server/application/services/logger/logger.service';
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
	private readonly logger = new LoggerService(EntriesUpdateUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesUpdateUseCaseParams) {
		try {
			this.logger.debug('Atualizando Entry com os parametros', params);
			const userUuid = await this.cookieService.getUUidFromCookie();
			const entry = await prisma.entry.update({
				where: {
					uuid: params.entryUuid!,
					account: {
						uuid: params.accountUuid!,
						user: {
							some: {
								uuid: userUuid
							}
						}
					},
				},
				data: params.data,
				include: {
					subEntries: {
						select: {
							uuid: true,
							title: true,
							amount: true
						}
					},
					board: {
						select: {
							id: true,
							uuid: true,
							name: true,
						}
					},
				}
			});

			this.logger.debug('Entry completamente atualizada', entry);
			return ResponseService.Ok(entry);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
