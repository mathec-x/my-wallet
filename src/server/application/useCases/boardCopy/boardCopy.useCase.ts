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
          boardId: params.boardId!
        },
        include: {
          subEntries: {
            select: {
              title: true,
              amount: true
            }
          },
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
          accountId: entry.accountId,
          category: entry.category,
          boardId: board.id,
          future: true
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

      /**
       * @todo finish implementation
       * copy sub entries to new board entries, matching by title and amount (since the new board entries will have different uuids)
       */
      // this.logger.debug(`${entries.length} Entries copiadas para novo board: ${board.id}`, currentBoardEntries);
      // const subentries = currentBoardEntries.flatMap(e => {
      //   const newData = entries.find(en => en.title === e.title && en.amount === e.amount);
      //   return e.subEntries.map(s => ({
      //     entryId: newData?.id,
      //     title: s.title,
      //     amount: s.amount
      //   }));
      // }).filter(e => e.entryId);
      // this.logger.debug(`Coping current ${subentries.length} subentries`, { subentries });

      return ResponseService.Ok(entries);
    } catch (error) {
      return ResponseService.unknow(error);
    }
  }
}
