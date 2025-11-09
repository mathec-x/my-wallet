import { accountSelect } from '@/server/application/useCases/accountGet/accountGet.useCase';
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
        select: accountSelect,
        data: {
          name: params.accountName,
          user: {
            connect: {
              uuid: params.userUuid!
            }
          }
        }
      });

      return ResponseService.Created(newAccount);
    } catch (error) {
      return ResponseService.unknow(error);
    }
  }
}