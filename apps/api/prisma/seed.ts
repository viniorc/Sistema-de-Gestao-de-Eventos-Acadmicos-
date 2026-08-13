import { PrismaClient, EventStatus, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }) });
async function main() {
  const password = process.env.DEV_USER_PASSWORD;
  if (!password) throw new Error('DEV_USER_PASSWORD must be set to seed the development user.');
  await prisma.user.upsert({ where: { email: 'mariana@conexao.local' }, update: {}, create: { name: 'Mariana Costa', email: 'mariana@conexao.local', passwordHash: await argon2.hash(password, { type: argon2.argon2id }), status: UserStatus.ACTIVE, role: Role.PROMIC_COORDINATION } });
  for (const event of [{ year: 2026, status: EventStatus.ACTIVE }, { year: 2025, status: EventStatus.CLOSED }, { year: 2024, status: EventStatus.CLOSED }]) {
    await prisma.event.upsert({ where: { name_year: { name: 'CONEXÃO', year: event.year } }, update: { status: event.status }, create: { name: 'CONEXÃO', ...event } });
  }
}
main().finally(() => prisma.$disconnect());
