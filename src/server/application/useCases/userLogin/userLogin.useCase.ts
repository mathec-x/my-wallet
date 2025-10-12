import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { LoginRegisterFormSchema } from '@/shared/schemas';

export class UserUseCase {

  constructor(
    private readonly hashService: HashService,
  ) { }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  }

  async getUserByUuid(uuid: string) {
    const user = await prisma.user.findFirst({ where: { uuid } });
    return user;
  }

  async registerUser(data: LoginRegisterFormSchema) {
    const hashedPassword = await this.hashService.hash(data.password);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name
      }
    });
    return newUser;
  }
};