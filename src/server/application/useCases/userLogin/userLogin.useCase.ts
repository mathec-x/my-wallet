import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { LoginFormSchema } from '@/shared/schemas';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import 'server-only';

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
      return ResponseService.NotFound('Usuário não encontrado');
    }

    const jwt = this.hashService.generateAccessToken({
      uuid: user.uuid,
      email: user.email,
      exp: remeberMe ? '1d' : '7d'
    });

    const cookStore = await cookies();

    const cookieSettings: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: remeberMe
        // expires in 1d
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        // expires in 7d
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    cookStore.set('auth', jwt, cookieSettings);

    return ResponseService.Ok({
      uuid: user.uuid,
      jwt
    });
  }
};