import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';

type TokenPayload = { sub: string; email: string; role: Role };
type PublicUser = { id: string; name: string; email: string; roles: Role[] };
@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}
  private publicUser(user: User): PublicUser { return { id: user.id, name: user.name, email: user.email, roles: [user.role] }; }
  private payload(user: User): TokenPayload { return { sub: user.id, email: user.email, role: user.role }; }
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.toLowerCase());
    if (!user || user.status !== UserStatus.ACTIVE || !(await argon2.verify(user.passwordHash, password))) throw new UnauthorizedException('Invalid email or password.');
    return this.createSession(user);
  }
  async createSession(user: User) {
    const payload = this.payload(user);
    const accessToken = await this.jwt.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: (process.env.JWT_ACCESS_TTL ?? '15m') as never });
    const refreshToken = await this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: (process.env.JWT_REFRESH_TTL ?? '7d') as never });
    await this.users.setRefreshHash(user.id, await argon2.hash(refreshToken, { type: argon2.argon2id }));
    return { user: this.publicUser(user), accessToken, refreshToken };
  }
  async refresh(token: string | undefined) {
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.users.findById(payload.sub);
      if (!user || !user.refreshTokenHash || !(await argon2.verify(user.refreshTokenHash, token))) throw new UnauthorizedException();
      if (user.status !== UserStatus.ACTIVE) { await this.users.setRefreshHash(user.id, null); throw new UnauthorizedException(); }
      return this.createSession(user);
    } catch { throw new UnauthorizedException(); }
  }
  async logout(userId: string) { await this.users.setRefreshHash(userId, null); }
  async me(userId: string) { const user = await this.users.findById(userId); if (!user || user.status !== UserStatus.ACTIVE) throw new UnauthorizedException(); return this.publicUser(user); }
}
