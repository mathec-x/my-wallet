import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';

export interface AccountDeleteUseCaseParams {
	userUuid: string
	accountUuid: string
}

export class AccountDeleteUseCase {
	async execute(params: AccountDeleteUseCaseParams) {
		try {
			const data = await prisma.account.update({
				where: {
					uuid: params.accountUuid,
					user: {
						uuid: params.userUuid
					}
				},
				data: {
					deletedAt: new Date()
				}
			});

			return ResponseService.Ok(data);
		} catch (error: Error | unknown) {
			return ResponseService.unknow(error);
		}
	}
}