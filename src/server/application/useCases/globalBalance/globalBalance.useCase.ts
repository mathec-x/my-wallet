import { prisma } from '@/server/infra/prisma/client';

export class GlobalBalanceUseCase {
  constructor() { }

  async execute(accountIds: number[]) {
    const balances = await prisma.entry.groupBy({
      by: ['accountId', 'type'],
      where: {
        future: false,
        accountId: {
          in: accountIds
        }
      },
      _sum: {
        amount: true
      }
    });


    const reducer = balances.reduce((acc, cur) => {
      acc[cur.accountId] ??= 0;

      if (cur.type === 'EXPENSE') {
        acc[cur.accountId] = acc[cur.accountId] - (cur._sum.amount || 0);
      }

      if (cur.type === 'INCOME') {
        acc[cur.accountId] = acc[cur.accountId] + (cur._sum.amount || 0);
      }

      return acc;
    }, {} as { [accountId: number]: number });

    return reducer;
  }
}
