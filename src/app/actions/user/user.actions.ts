import { UserCurrentUseCase } from '@/server/application/useCases/userCurrent/userCurrent.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';

const hashService = new HashService();
const userCurrentUseCase = new UserCurrentUseCase(hashService);

export async function getCurrentUser() {
  return userCurrentUseCase.execute();
}