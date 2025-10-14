'use server';

import { AccountDeleteUseCase, AccountDeleteUseCaseParams } from '@/server/application/useCases/accountDelete/accountDelete.useCase';
import { AccountRegisterUseCase, AccountRegisterUseCaseParams } from '@/server/application/useCases/accountRegister/accountRegister.useCase';

const accountRegisterUseCase = new AccountRegisterUseCase();
const accountDeleteUseCase = new AccountDeleteUseCase();

export async function registerAccountAction(params: AccountRegisterUseCaseParams) {
  return accountRegisterUseCase.execute(params);
}

export async function deleteAccountAction(params: AccountDeleteUseCaseParams) {
  return accountDeleteUseCase.execute(params);
}