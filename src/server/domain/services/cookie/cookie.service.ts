import { cookies } from 'next/headers';
import 'server-only';
import { HashService } from '../hash/hash.service';

export class CookieService {
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
}