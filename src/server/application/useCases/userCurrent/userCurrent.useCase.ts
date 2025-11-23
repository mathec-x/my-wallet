import { LoggerService } from '@/server/application/services/logger/logger.service';
import { accountSelect } from '@/server/application/useCases/accountGet/accountGet.useCase';
import { GlobalBalanceUseCase } from '@/server/application/useCases/globalBalance/globalBalance.useCase';
import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { cookies } from 'next/headers';
import 'server-only';

export class UserCurrentUseCase {
  private readonly logger = new LoggerService(UserCurrentUseCase.name);

  constructor(
    private readonly hashService: HashService,
    private readonly globalBalanceUseCase: GlobalBalanceUseCase
  ) { }

  async execute() {
    try {
      const cookStore = await cookies();
      const token = cookStore.get('auth')?.value;

      if (!token) {
        this.logger.warn('No auth token found in cookies');
        return null;
      }

      this.logger.verbose('Fetching current user');
      const payload = this.hashService.verifyAccessToken(token);

      this.logger.verbose('Fetching user from database');
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

      this.logger.verbose('User Found');
      if (user.accounts.length > 0) {
        this.logger.info(`Calculating global balances (${user.accounts.length}) for user accounts`);
        const balances = await this.globalBalanceUseCase.execute(user.accounts.map(a => a.id));
        for (const account of user.accounts) {
          account.balance = balances[account.id];
        }
      }

      return user;
    } catch (error) {
      this.logger.error('getCurrentUser exception', ResponseService.unknow(error));
      return null;
    }
  }
}