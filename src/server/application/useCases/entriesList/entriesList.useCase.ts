import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface EntriesListUseCaseParams {
	accountUuid: string;
}

export class EntriesListUseCase {

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesListUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			const data = await prisma.entry.findMany({
				where: {
					account: {
						uuid: params.accountUuid,
						user: {
							uuid: userUuid
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
