import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface EntriesListUseCaseParams {
	accountUuid: string;
	userUuid: string
}

export class EntriesListUseCase {
	async execute(params: EntriesListUseCaseParams) {
		try {
			const data = await prisma.entry.findMany({
				where: {
					account: {
						uuid: params.accountUuid,
						user: {
							uuid: params.userUuid
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
