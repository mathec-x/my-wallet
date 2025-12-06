import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface BoardCreateUseCaseParams {
	accountUuid: string;
	boardId?: number;
	entriesIds: number[];
	boardName: string
}

export class BoardCreateUseCase {
	private readonly logger = new LoggerService(BoardCreateUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: BoardCreateUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();

			const board = await prisma.board.upsert({
				where: { id: params.boardId },
				create: { name: params.boardName },
				update: { name: params.boardName },
				select: {
					id: true,
					uuid: true,
					name: true,
					entries: {
						select: {
							id: true
						}
					}
				}
			});

			this.logger.info(
				`board ${params.boardId ? 'updated' : 'created'} id:${board.id}; name:${board.name}`
			);
			if (!params.boardId) {
				const entries = await prisma.entry.updateManyAndReturn({
					where: {
						account: {
							uuid: params.accountUuid,
							user: {
								some: {
									uuid: userUuid
								}
							}
						},
						id: {
							in: params.entriesIds
						}
					},
					data: {
						boardId: board.id
					}
				});

				const ids = entries.map(e => e.id);
				this.logger.info(`entries alocadas ao novo board: ${board.name} (${entries.length}) [${ids}]`);
				board.entries = ids.map(i => ({ id: i }));
			}

			return ResponseService.Ok(board);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	}
}
