import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';
@ApiTags('events') @ApiCookieAuth() @UseGuards(AuthGuard) @Controller('events') export class EventsController { constructor(private readonly events: EventsService) {} @Get() list() { return this.events.list(); } }
