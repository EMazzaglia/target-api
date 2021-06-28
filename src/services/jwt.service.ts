import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET, ACCESS_TOKEN_LIFE } from '@config';
import { Service } from 'typedi';

@Service()
export class JWTService {
  createJWT(user: User): string {
    let token;
    try {
      token = jwt.sign(
        { data: { userId: user.id, email: user.email } },
        JWT_SECRET || '',
        { expiresIn: ACCESS_TOKEN_LIFE || '6h' }
      );
    } catch (error) {
      new Error('Error creating JWT');
    }
    return token;
  }

  decodeJWT(token: string): string | { [key: string]: any } | null {
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (error) {
      new Error('Error decoding JWT');
    }
    return decoded;
  }

  verifyJWT(token = ''): string | { [key: string]: any } | null {
      let verify;
      try {
        verify = jwt.verify(token, JWT_SECRET || '');
      } catch (error) {
        new Error('Error verifying JWT');
      }
      return verify;
  }
}
