import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { cookies } from 'next/headers';

export class UserCurrentUseCase {

  constructor(
    private readonly hashService: HashService
  ) { }

  async execute() {
    try {
      const cookStore = await cookies();
      const token = cookStore.get('auth')?.value;

      if (!token) {
        return null;
      }

      const payload = this.hashService.verifyAccessToken(token);
      const user = await prisma.user.findFirst({
        select: {
          uuid: true,
          name: true,
          email: true
        },
        where: {
          uuid: payload.uuid
        }
      });

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}