import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const migrateLegacyBanners = async () => {
  const result = await prisma.homepageBanner.deleteMany();
  console.log(`Removed ${result.count} legacy homepage banner record(s).`);
};

migrateLegacyBanners()
  .catch((error) => {
    console.error('Banner migration failed:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
