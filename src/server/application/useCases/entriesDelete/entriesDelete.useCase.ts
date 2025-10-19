import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface EntriesDeleteUseCaseParams {
	accountUuid: string;
	entryUuid: string;
}

export class EntriesDeleteUseCase {
	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesDeleteUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			const data = await prisma.entry.delete({
				where: {
					uuid: params.entryUuid,
					account: {
						uuid: params.accountUuid,
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

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
