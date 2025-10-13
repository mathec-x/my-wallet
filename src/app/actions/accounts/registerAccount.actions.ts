'use server';

import { AccountRegisterUseCase, AccountRegisterUseCaseParams } from '@/server/application/useCases/accountRegister/accountRegister.useCase';

const accountRegisterUseCase = new AccountRegisterUseCase();

export async function registerAccountAction(params: AccountRegisterUseCaseParams) {
  return accountRegisterUseCase.execute(params);
}