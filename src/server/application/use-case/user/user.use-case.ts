import { LoginRegisterFormSchema } from '@/app/components/schemas';
import { ResponseService } from '@/server/domain/common/ResponseService';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';

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
    const currentUser = await this.getUserByEmail(data.email);

    if (currentUser) {
      return ResponseService.Conflict('Email já cadastrado');
    }

    const hashedPassword = await this.hashService.hash(data.password);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name
      }
    });
    return ResponseService.Created({ uuid: newUser.uuid });
  }
};