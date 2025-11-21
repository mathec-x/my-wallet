import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';
import { LoggerService } from '../../services/logger/logger.service';

export interface EntriesListUseCaseParams {
	accountUuid: string;
}

export class EntriesListUseCase {
	private readonly logger = new LoggerService(EntriesListUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: EntriesListUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			this.logger.debug(`Listing entries for account ${params.accountUuid} and user ${userUuid}`);
			const data = await prisma.entry.findMany({
				where: {
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
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});
			this.logger.debug(`Found ${data.length} entries for account ${params.accountUuid} and user ${userUuid}`);
			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
