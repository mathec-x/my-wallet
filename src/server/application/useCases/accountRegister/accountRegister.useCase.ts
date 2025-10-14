import { ResponseService } from '@/server/domain/common/response.service';
import { prisma } from '@/server/infra/prisma/client';
import 'server-only';

export interface AccountRegisterUseCaseParams {
  userUuid: string
  accountName: string
}

export class AccountRegisterUseCase {
  async execute(params: AccountRegisterUseCaseParams) {
    try {
      const newAccount = await prisma.account.create({
        select: {
          uuid: true,
          name: true,
          balance: true
        },
        data: {
          name: params.accountName,
          user: {
            connect: {
              uuid: params.userUuid
            }
          }
        }
      });

      return ResponseService.Created(newAccount);
    } catch (error: Error | unknown) {
      return ResponseService.BadRequest((error as Error)?.message, error);
    }
  }
}