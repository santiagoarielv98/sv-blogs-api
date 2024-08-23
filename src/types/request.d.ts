import '@nestjs/common';
import type { AuthUser } from 'src/auth/auth.interface';

declare module '@nestjs/common' {
  export interface Request {
    user: AuthUser;
  }
}
