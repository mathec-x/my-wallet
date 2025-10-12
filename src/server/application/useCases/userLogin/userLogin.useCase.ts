import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { LoginFormSchema } from '@/shared/schemas';
import { cookies } from 'next/headers';

export class UserLoginUseCase {

  constructor(
    private readonly hashService: HashService,
  ) { }

  async execute({ email, password, remeberMe }: LoginFormSchema) {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return ResponseService.NotFound('Usuário não encontrado');
    }

    const hashString = await this.hashService.compare(password, user.password);
    if (!hashString) {
      return ResponseService.NotFound('Usuário não encontrado Password');
    }

    const jwt = this.hashService.generateAccessToken({
      uuid: user.uuid,
      email: user.email,
      exp: remeberMe ? '1d' : '7d'
    });

    const cookStore = await cookies();

    cookStore.set('auth', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: remeberMe
        // expires in 1d
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        // expires in 7d
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }
};