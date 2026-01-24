import { HashService } from '@/server/domain/services/hash/hash.service';
import { before, describe, it } from 'node:test';
import { UserResetPasswordUseCase } from './userResetPassword.useCase';

const makeUserResetPassword = () => new UserResetPasswordUseCase(
  new HashService()
);

describe('UserResetPasswordUseCase', () => {
  let userResetPasswordUseCase: UserResetPasswordUseCase;

  before(() => {
    userResetPasswordUseCase = makeUserResetPassword();
  });

  it('should execute', async () => {
    const result = await userResetPasswordUseCase.execute({
      email: 'loren@ispun.com',
      password: 'loren_ipsun',
      newPassword: 'loren_ipsun_new',
      confirmPassword: 'loren_ipsun_new',
      confirmationCode: 'a1b2c3'
    });

    console.log(result);
  });
});