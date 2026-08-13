import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import Joi from 'joi';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'], validationSchema: Joi.object({ NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'), DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(), API_PORT: Joi.number().port().default(3001), CORS_ORIGIN: Joi.string().uri().required(), JWT_ACCESS_SECRET: Joi.string().min(32).required(), JWT_REFRESH_SECRET: Joi.string().min(32).required(), JWT_ACCESS_TTL: Joi.string().required(), JWT_REFRESH_TTL: Joi.string().required(), DEV_USER_PASSWORD: Joi.string().optional() }).unknown(true) }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]), PrismaModule, UsersModule, AuthModule, EventsModule, HealthModule] })
export class AppModule {}
