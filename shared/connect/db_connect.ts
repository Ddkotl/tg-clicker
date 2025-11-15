import { Prisma, PrismaClient } from "@/_generated/prisma";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const dataBase = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = dataBase;

export type TransactionType = Prisma.TransactionClient;
