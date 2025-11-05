import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import type { Prisma } from '@/server/infra/prisma/generated';
import 'server-only';

export type AccountGetUseCaseParams = Prisma.AccountFindFirstArgs

export class AccountGetUseCase {
	async execute(params: AccountGetUseCaseParams) {
		try {

			const data = await prisma.account.findFirstOrThrow({
				...params
			});

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
