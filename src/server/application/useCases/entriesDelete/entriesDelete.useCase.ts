import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface EntriesDeleteUseCaseParams {
	accountUuid: string;
	userUuid: string
}

export class EntriesDeleteUseCase {
	execute(params: EntriesDeleteUseCaseParams) {
		try {
			const data = prisma.entry.deleteMany({
				where: {
					account: {
						uuid: params.accountUuid,
						user: {
							uuid: params.userUuid
						}
					}
				}
			});

			return ResponseService.Ok(data);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
