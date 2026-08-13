import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable() export class EventsService { constructor(private readonly prisma: PrismaService) {} list() { return this.prisma.event.findMany({ select: { id: true, name: true, year: true, status: true }, orderBy: { year: 'desc' } }); } }
