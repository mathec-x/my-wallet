import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface BoardDeleteUseCaseParams {
	uuid: string
}

export class BoardDeleteUseCase {
	private readonly logger = new LoggerService(BoardDeleteUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: BoardDeleteUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();

			this.logger.info(`deletando board ${params.uuid}`);
			const { count } = await prisma.entry.deleteMany({
				where: {
					board: { uuid: params.uuid! },
					account: {
						user: {
							some: {
								uuid: userUuid
							}
						}
					}
				}
			});

			const res = await prisma.board.delete({
				where: {
					uuid: params.uuid
				}
			});

			this.logger.info(`board ${res.name} deletado junto com ${count} entries`);
			return ResponseService.Created(res);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
