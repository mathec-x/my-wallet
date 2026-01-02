'use server';

import { AccountDeleteUseCase, type AccountDeleteUseCaseParams } from '@/server/application/useCases/accountDelete/accountDelete.useCase';
import { AccountGetUseCase, type AccountGetUseCaseParams } from '@/server/application/useCases/accountGet/accountGet.useCase';
import { AccountRegisterUseCase, type AccountRegisterUseCaseParams } from '@/server/application/useCases/accountRegister/accountRegister.useCase';
import { CookieService } from '@/server/domain/services/cookie/cookie.service';
import { cache } from 'react';

const cookieService = new CookieService();
const accountRegisterUseCase = new AccountRegisterUseCase();
const accountDeleteUseCase = new AccountDeleteUseCase();
const accountGetUseCase = new AccountGetUseCase(cookieService);

export async function registerAccountAction(params: AccountRegisterUseCaseParams) {
  return accountRegisterUseCase.execute(params);
}

export async function deleteAccountAction(params: AccountDeleteUseCaseParams) {
  return accountDeleteUseCase.execute(params);
}

export const accountGetAction = cache(async (params: AccountGetUseCaseParams) => {
  return accountGetUseCase.execute(params);
});