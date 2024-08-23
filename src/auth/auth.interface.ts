export interface JwtPayload {
  sub: string;
  username: string;
}

export interface AuthUser {
  userId: string;
  username: string;
}
