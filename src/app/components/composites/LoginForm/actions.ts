'use server';

import { LoginFormSchema, LoginRegisterFormSchema, loginRegisterFormSchema, LoginResetFormSchema } from '@/app/components/schemas';
import { UserUseCase } from '@/server/application/use-case/user/user.use-case';
import { HashService } from '@/server/domain/services/hash/hash.service';

const hashService = new HashService();
const userUseCase = new UserUseCase(hashService);

export async function loginAction(data: LoginFormSchema) {
  console.log(data);
}

export async function registerAction(data: LoginRegisterFormSchema) {
  const parsed = loginRegisterFormSchema.parse(data);

  if (!parsed) {
    throw new Error('Invalid data');
  }

  return userUseCase.registerUser(parsed);
}

export async function resetAction(data: LoginResetFormSchema) {
  console.log(data);
}