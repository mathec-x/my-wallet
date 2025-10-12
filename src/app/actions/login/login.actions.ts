'use server';

import { UserLoginUseCase } from '@/server/application/useCases/userLogin/userLogin.useCase';
import { UserRegisterUseCase } from '@/server/application/useCases/userRegister/userRegister.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { LoginFormSchema, LoginRegisterFormSchema } from '@/shared/schemas';

const hashService = new HashService();
const userLoginUseCase = new UserLoginUseCase(hashService);
const userRegisterUseCase = new UserRegisterUseCase(hashService);

export async function loginAction(data: LoginFormSchema) {
  return userLoginUseCase.execute(data);
}

export async function registerAction(data: LoginRegisterFormSchema) {
  return userRegisterUseCase.execute(data);
}

