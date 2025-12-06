import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export type AccountGetUseCaseParams = {
	accountUuid: string
}

export const accountSelect = {
	id: true,
	uuid: true,
	name: true,
	balance: true
};

export class AccountGetUseCase {
	private readonly logger = new LoggerService(AccountGetUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: AccountGetUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			this.logger.debug('Obtendo conta', params);
			const data = await prisma.account.findFirst({
				where: {
					uuid: params.accountUuid,
					user: {
						some: {
							uuid: userUuid
						}
					}
				},
				select: accountSelect
			});

			if (data) {
				this.logger.info('Conta encontrada');
				return ResponseService.Ok(data);
			}

			this.logger.warn('Nenhuma Entry relacionada a esta conta');
			return ResponseService.NotFound();
		} catch (error) {
			this.logger.error('Falha ao obter conta', error);
			return ResponseService.unknow(error);
		}
	};
}
