import { LoggerService } from '@/server/application/services/logger/logger.service';
import { cookies } from 'next/headers';
import 'server-only';
import { HashService } from '../hash/hash.service';

export class CookieService {
  private readonly logger = new LoggerService(CookieService.name);
  private readonly hashService = new HashService();

  async getUUidFromCookie() {
    const cookStore = await cookies();
    const token = cookStore.get('auth')?.value;

    if (!token) {
      throw new Error('No token found in cookies');
    }

    const payload = this.hashService.verifyAccessToken(token);
    return payload.uuid;
  }

  async forPrismaAccountInstance() {
    const userUuid = await this.getUUidFromCookie();
    const stm = { some: { uuid: userUuid } };
    this.logger.debug('Incluíndo user na query', stm);
    return stm;
  }
}