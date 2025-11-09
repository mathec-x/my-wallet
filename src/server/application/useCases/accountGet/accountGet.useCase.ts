import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import type { Prisma } from '@/server/infra/prisma/generated';
import 'server-only';

export type AccountGetUseCaseParams = Prisma.AccountFindFirstArgs

export const accountSelect = {
	id: true,
	uuid: true,
	name: true,
	balance: true
};

export class AccountGetUseCase {
	private readonly logger = new LoggerService(AccountGetUseCase.name);
	async execute(params: AccountGetUseCaseParams) {
		try {
			this.logger.debug('Obtendo conta', params);
			const data = await prisma.account.findFirst(params);
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
