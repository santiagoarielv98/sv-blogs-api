import '@nestjs/common';

declare module '@nestjs/common' {
  interface Request {
    user: any;
  }
}
