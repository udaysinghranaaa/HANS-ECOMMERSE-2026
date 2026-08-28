import { PrismaClient } from '@prisma/client';
import config from './index.js';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.env === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (config.env !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
