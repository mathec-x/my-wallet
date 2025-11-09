import { LoggerService } from '@/server/application/services/logger/logger.service';
import { accountSelect } from '@/server/application/useCases/accountGet/accountGet.useCase';
import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { cookies } from 'next/headers';
import 'server-only';

export class UserCurrentUseCase {
  private readonly logger = new LoggerService(UserCurrentUseCase.name);

  constructor(
    private readonly hashService: HashService
  ) { }

  async execute() {
    try {
      const cookStore = await cookies();
      const token = cookStore.get('auth')?.value;

      if (!token) {
        this.logger.warn('No auth token found in cookies');
        return null;
      }

      const payload = this.hashService.verifyAccessToken(token);
      const user = await prisma.user.findFirst({
        select: {
          uuid: true,
          name: true,
          email: true,
          accounts: {
            select: accountSelect,
            where: {
              deletedAt: null
            }
          }
        },
        where: {
          uuid: payload.uuid
        }
      });

      if (!user) {
        this.logger.warn('User not found');
        return null;
      }

      if (user.accounts.length > 0) {
        const balances = await prisma.entry.groupBy({
          by: 'accountId',
          where: {
            future: false,
            accountId: {
              in: user.accounts.map(a => a.id)
            }
          },
          _sum: {
            amount: true
          }
        });
        this.logger.debug('balances', balances);
        for (const account of user.accounts) {
          account.balance = balances.find(e => e.accountId === account.id)?._sum.amount || 0;
        }
      }

      return user;
    } catch (error) {
      this.logger.error('getCurrentUser exception', ResponseService.unknow(error));
      return null;
    }
  }
}