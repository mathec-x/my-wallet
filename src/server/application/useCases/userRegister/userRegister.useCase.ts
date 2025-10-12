import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { loginRegisterFormSchema, LoginRegisterFormSchema } from '@/shared/schemas';

export class UserRegisterUseCase {

  constructor(
    private readonly hashService: HashService,
  ) { }

  async execute(data: LoginRegisterFormSchema) {
    const parsed = loginRegisterFormSchema.parse(data);
    if (!parsed) {
      return ResponseService.PreconditionFailed('Formulário inválido');
    }

    const currentUser = await prisma.user.findFirst({ where: { email: data.email } });

    if (currentUser) {
      return ResponseService.Conflict('Usuário já esta registrado');
    }

    const hashedPassword = await this.hashService.hash(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name
      }
    });

    if (!user) {
      return ResponseService.BadRequest('Falha ao cadastrar usuário');
    }

    return ResponseService.Created({ uuid: user.uuid });
  }
};