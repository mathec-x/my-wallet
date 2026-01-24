'use server';

import { UserLoginUseCase } from '@/server/application/useCases/userLogin/userLogin.useCase';
import { UserRegisterUseCase } from '@/server/application/useCases/userRegister/userRegister.useCase';
import { UserResetPasswordUseCase } from '@/server/application/useCases/userResetPassword/userResetPassword.useCase';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { LoginFormSchema, LoginRegisterFormSchema, LoginResetFormSchema } from '@/shared/schemas';

const hashService = new HashService();
const userLoginUseCase = new UserLoginUseCase(hashService);
const userRegisterUseCase = new UserRegisterUseCase(hashService);
const userResetPasswordUseCase = new UserResetPasswordUseCase(hashService);

export async function loginAction(data: LoginFormSchema) {
  return userLoginUseCase.execute(data);
}

export async function registerAction(data: LoginRegisterFormSchema) {
  return userRegisterUseCase.execute(data);
}

export async function resetAction(data: LoginResetFormSchema) {
  return userResetPasswordUseCase.execute(data);
}
