CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PROMIC_COORDINATION', 'COMMITTEE', 'EVALUATOR', 'MONITOR', 'AUTHOR', 'PUBLIC');
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');
CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "name" TEXT NOT NULL, "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL, "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "role" "Role" NOT NULL DEFAULT 'PROMIC_COORDINATION', "refreshTokenHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Event" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "name" TEXT NOT NULL, "year" INTEGER NOT NULL,
  "status" "EventStatus" NOT NULL DEFAULT 'DRAFT', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_status_idx" ON "User"("status");
CREATE UNIQUE INDEX "Event_name_year_key" ON "Event"("name", "year");
CREATE INDEX "Event_status_year_idx" ON "Event"("status", "year");
