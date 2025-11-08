import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface EntriesDeleteUseCaseParams {
	accountUuid: string;
	entryUuid: string;
}

export class EntriesDeleteUseCase {
	private readonly logger = new LoggerService(EntriesDeleteUseCase.name);
	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesDeleteUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			const data = await prisma.entry.delete({
				where: {
					uuid: params.entryUuid!,
					account: {
						uuid: params.accountUuid!,
						user: {
							uuid: userUuid
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

			const countItems = await prisma.entry.count({ where: { boardId: data.boardId } });
			if (data.boardId && countItems === 0) {
				this.logger.warn(`Delete board id: ${data.boardId} por falta de entries`);
				await prisma.board.delete({ where: { id: data.boardId } });
			}

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
