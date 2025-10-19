import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';
import { styleText } from 'util';

export interface BoardCreateUseCaseParams {
	accountUuid: string;
	boardId?: number;
	entriesIds: number[];
	boardName: string
}

export class BoardCreateUseCase {
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

			console.log(
				`${styleText('green', `board ${params.boardId ? 'updated' : 'created'}`)} id:${board.id}; name:${board.name}`
			);
			if (!params.boardId) {
				const entries = await prisma.entry.updateManyAndReturn({
					where: {
						account: {
							uuid: params.accountUuid,
							user: {
								uuid: userUuid
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
				console.log(`${styleText('green', 'entries editadas')} (${entries.length}) [${ids}]`);
				board.entries = ids.map(i => ({ id: i }));
			}

			return ResponseService.Ok(board);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	}
}
