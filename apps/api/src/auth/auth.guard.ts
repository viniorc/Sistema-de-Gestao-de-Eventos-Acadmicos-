import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
@Injectable() export class AuthGuard implements CanActivate { constructor(private readonly jwt: JwtService) {} async canActivate(context: ExecutionContext) { const request = context.switchToHttp().getRequest<Request & { user?: { sub: string; email: string; role: string } }>(); const token = request.cookies?.access_token; if (!token) throw new UnauthorizedException(); try { request.user = await this.jwt.verifyAsync<{ sub: string; email: string; role: string }>(token, { secret: process.env.JWT_ACCESS_SECRET }); return true; } catch { throw new UnauthorizedException(); } } }
