import { GlobalBalanceUseCase } from '@/server/application/useCases/globalBalance/globalBalance.useCase';
import { UserCurrentUseCase } from '@/server/application/useCases/userCurrent/userCurrent.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';

const hashService = new HashService();
const globalBalanceUseCase = new GlobalBalanceUseCase;
const userCurrentUseCase = new UserCurrentUseCase(hashService, globalBalanceUseCase);

export async function getCurrentUser() {
  return userCurrentUseCase.execute();
}