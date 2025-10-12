import { compare, hash } from 'bcrypt';
import { sign, SignOptions, verify } from 'jsonwebtoken';

interface JwtPayloadInterface { uuid: string, email: string, exp: SignOptions['expiresIn'] }

const jwtSecret: string = process.env.JWT_SECRET || '';
export class HashService {
  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  generateAccessToken({ exp = '1h', ...payload }: JwtPayloadInterface) {
    return sign(payload, jwtSecret, { expiresIn: exp });
  }

  verifyAccessToken(token: string) {
    return verify(token, jwtSecret) as JwtPayloadInterface;
  }
}