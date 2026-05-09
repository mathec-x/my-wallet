import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface SubEntriesUpdateUseCaseParams {
	entryUuid: string;
	subEntries: {
		uuid: string;
		title: string;
		amount: number;
	}[];
}

export class SubEntriesUpdateUseCase {
	private readonly logger = new LoggerService(SubEntriesUpdateUseCase.name);

	constructor(
		private readonly cookieService: CookieService
	) { }

	async execute(params: SubEntriesUpdateUseCaseParams) {
		try {
			const userUuid = await this.cookieService.getUUidFromCookie();
			this.logger.debug('Atualizando Sub-Entry com os parametros', { ...params, userUuid });

			const uuidsToKeep = params.subEntries
				.filter(se => se.uuid)
				.map(se => se.uuid!);

			await prisma.$transaction(async (tx) => {
				this.logger.info(`SubEntries para sincronizar: ${uuidsToKeep.length}`);
				const removeds = await tx.subEntry.deleteMany({
					where: {
						uuid: { notIn: uuidsToKeep },
						entry: {
							uuid: params.entryUuid,
							account: {
								user: {
									some: {
										uuid: userUuid!
									}
								}
							}
						}
					}
				});

				this.logger.info(`Total SubEntries removidas: ${removeds.count}`);
				for (const subEntry of params.subEntries!) {
					if (subEntry.uuid) {
						this.logger.info(`Atualizando SubEntry '${subEntry.title}' (UUID: ${subEntry.uuid})`, subEntry);
						await tx.subEntry.update({
							where: {
								uuid: subEntry.uuid,
								entry: {
									uuid: params.entryUuid,
									account: {
										user: {
											some: {
												uuid: userUuid!
											}
										}
									}
								}
							},
							data: {
								title: subEntry.title,
								amount: subEntry.amount || 0
							}
						});
					} else {
						this.logger.info(`Criando SubEntry '${subEntry.title}'`, subEntry);
						await tx.subEntry.create({
							data: {
								title: subEntry.title,
								amount: subEntry.amount,
								entry: {
									connect: {
										uuid: params.entryUuid
									}
								}
							}
						});
					}
				}
			});

			return ResponseService.Ok({ success: true });
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
