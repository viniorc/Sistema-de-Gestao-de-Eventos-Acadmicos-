import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginDto } from './dto';
type AuthedRequest = Request & { user: { sub: string } };

@ApiTags('auth') @Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  private setTokens(response: Response, tokens: { accessToken: string; refreshToken: string }) {
    const secure = process.env.NODE_ENV === 'production';
    response.cookie('access_token', tokens.accessToken, { httpOnly: true, secure, sameSite: 'lax', maxAge: 15 * 60 * 1000, path: '/' });
    response.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/v1/auth' });
  }
  @Post('login') @Throttle({ default: { limit: 10, ttl: 60_000 } }) @HttpCode(200) @ApiOperation({ summary: 'Sign in and set session cookies' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) { const session = await this.auth.login(dto.email, dto.password); this.setTokens(response, session); return session.user; }
  @Post('refresh') @HttpCode(200) async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) { const session = await this.auth.refresh(request.cookies?.refresh_token); this.setTokens(response, session); return session.user; }
  @Post('logout') @UseGuards(AuthGuard) @HttpCode(204) async logout(@Req() request: AuthedRequest, @Res({ passthrough: true }) response: Response) { await this.auth.logout(request.user.sub); response.clearCookie('access_token').clearCookie('refresh_token', { path: '/api/v1/auth' }); }
  @Get('me') @UseGuards(AuthGuard) @ApiCookieAuth() async me(@Req() request: AuthedRequest) { return this.auth.me(request.user.sub); }
  @Post('forgot-password') @Throttle({ default: { limit: 5, ttl: 60_000 } }) @HttpCode(200) async forgotPassword(@Body() _dto: ForgotPasswordDto) { return { message: 'Se o endereço estiver cadastrado, enviaremos as instruções de recuperação.' }; }
}
