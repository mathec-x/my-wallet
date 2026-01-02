import { GlobalBalanceUseCase } from '@/server/application/useCases/globalBalance/globalBalance.useCase';
import { UserCurrentUseCase } from '@/server/application/useCases/userCurrent/userCurrent.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { cache } from 'react';

const hashService = new HashService();
const globalBalanceUseCase = new GlobalBalanceUseCase;
const userCurrentUseCase = new UserCurrentUseCase(hashService, globalBalanceUseCase);

export const getCurrentUser = cache(async () => {
  return userCurrentUseCase.execute();
});