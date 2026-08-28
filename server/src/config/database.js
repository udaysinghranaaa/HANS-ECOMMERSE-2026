import dns from 'dns';
import config from './index.js';
import prisma from './prisma.js';

export const connectDatabase = async () => {
  const uri = config.mongodbUri;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (uri.startsWith('mongodb+srv://')) {
    // Some ISP/residential DNS servers refuse SRV lookups required by mongodb+srv URIs.
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    dns.setDefaultResultOrder('ipv4first');
  }

  await prisma.$connect();

  console.log('MongoDB connected via Prisma');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
