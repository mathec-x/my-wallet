import { LoggerService } from '@/server/application/services/logger/logger.service';
import { ResponseService } from '@/server/domain/common/response.service';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface BoardCopyUseCaseParams {
  accountUuid: string,
  boardId: number,
}

export class BoardCopyUseCase {
  private readonly logger = new LoggerService(BoardCopyUseCase.name);
  constructor(
    private readonly cookieService: CookieService
  ) { }

  async execute(params: BoardCopyUseCaseParams) {
    try {


      const currentBoardEntries = await prisma.entry.findMany({
        where: {
          boardId: params.boardId
        }
      });

      if (currentBoardEntries.length === 0) {
        return ResponseService.BadRequest('Sem Entries para copiar');
      }

      this.logger.info(`Copying (${currentBoardEntries.length}) entries for boardId: ${params.boardId}`);
      const board = await prisma.board.create({
        data: {
          name: '',
        }
      });

      const entries = await prisma.entry.createManyAndReturn({
        data: currentBoardEntries.map(entry => ({
          title: entry.title,
          description: entry.description,
          amount: entry.expected || entry.amount,
          expected: entry.expected,
          type: entry.type,
          order: entry.order,
          future: entry.future,
          accountId: entry.accountId,
          category: entry.category,
          boardId: board.id
        })),
        include: {
          board: {
            select: {
              id: true,
              uuid: true,
              name: true
            }
          }
        }
      });

      this.logger.info(`${entries.length} Entries copiadas para novo board: ${board.id}`);
      return ResponseService.Ok(entries);
    } catch (error) {
      return ResponseService.unknow(error);
    }
  }
}
