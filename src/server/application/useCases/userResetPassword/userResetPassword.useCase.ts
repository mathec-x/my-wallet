import { ResponseService } from '@/server/domain/common/response.service';
import { HashService } from '@/server/domain/services/hash/hash.service';
import { prisma } from '@/server/infra/prisma/client';
import { loginResetFormSchema, LoginResetFormSchema } from '@/shared/schemas';
import 'server-only';
import { LoggerService } from '../../services/logger/logger.service';

export class UserResetPasswordUseCase {
  private readonly logger = new LoggerService(UserResetPasswordUseCase.name);

  constructor(
    private readonly hashService: HashService,
  ) { }

  async execute(data: LoginResetFormSchema) {
    try {
      this.logger.info(`Parsing schema data for email: ${data.email}`);
      const parsed = loginResetFormSchema.parse(data);
      if (!parsed) {
        return ResponseService.PreconditionFailed('Formulário inválido');
      }

      this.logger.info(`Searching user for email: ${data.email}`);
      const user = await prisma.user.findFirst({ where: { email: data.email } });
      if (!user) {
        return ResponseService.NotFound('Usuário/Senha invalido');
      }

      const confirmationCode = await prisma.userConfirmationCode.findFirst({
        where: { email: user.email, code: data.confirmationCode }
      });

      if (!confirmationCode) {
        return ResponseService.BadRequest('Código de confirmação inválido (envio de email não implementado)');
      }

      // 6h expiration
      if (confirmationCode.createdAt.getTime() + 6 * 60 * 60 * 1000 < Date.now()) {
        return ResponseService.BadRequest('Código de confirmação expirado');
      }

      this.logger.info(`Comparing body password to reset: ${user.email} id: ${user.id}`);
      const hashString = await this.hashService.compare(data.password, user.password);
      if (!hashString) {
        return ResponseService.NotFound('Usuário/Senha invalido');
      }

      const updatedUser = await this.updateUserPassword(user, data.newPassword);

      if (!updatedUser) {
        return ResponseService.BadRequest('Falha ao cadastrar usuário');
      }

      await this.deleteConfirmationCode(data.email, data.confirmationCode);

      return ResponseService.Created({ uuid: updatedUser.uuid });
    } catch (error: Error | unknown) {
      return ResponseService.InternalError((error as Error)?.message || 'Error interno', error);
    }
  }

  private async updateUserPassword(user: { id: number, email: string }, newPassword: string) {
    this.logger.info(`Resetting password for user: ${user.email} id: ${user.id}`);
    const hashedPassword = await this.hashService.hash(newPassword);
    return prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
  }

  private async deleteConfirmationCode(email: string, code: string) {
    this.logger.info(`Deleting confirmation code for email: ${email}`);
    return prisma.userConfirmationCode.deleteMany({
      where: { email, code }
    });
  }
};