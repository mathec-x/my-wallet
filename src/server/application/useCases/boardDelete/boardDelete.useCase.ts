import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';
import { styleText } from 'util';

export interface BoardDeleteUseCaseParams {
	uuid: string
}

export class BoardDeleteUseCase {
	async execute(params: BoardDeleteUseCaseParams) {
		try {
			console.log(styleText('red', `deletando board ${params.uuid}`));
			const res = await prisma.board.delete({
				where: {
					uuid: params.uuid
				}
			});
			console.log(styleText('red', `board ${res.name} deletado`));
			return ResponseService.Created(res);
		} catch (error) {
			return ResponseService.unknow(error);
		}
	};
}
