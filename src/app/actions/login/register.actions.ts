'use server';

import { UserRegisterUseCase } from '@/server/application/useCases/userRegister/userRegister.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { LoginRegisterFormSchema } from '@/shared/schemas';

const hashService = new HashService();
const userRegisterUseCase = new UserRegisterUseCase(hashService);

export async function registerAction(data: LoginRegisterFormSchema) {
  return userRegisterUseCase.execute(data);
}

