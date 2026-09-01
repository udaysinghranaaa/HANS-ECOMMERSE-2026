import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { decryptTotpSecret } from '../src/utils/totpCrypto.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const diagnose = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({ where: { email } });

  console.log('totpEnabled:', admin?.totpEnabled);
  console.log('hasEncryptedSecret:', Boolean(admin?.totpSecretEncrypted));

  if (!admin?.totpSecretEncrypted) {
    return;
  }

  try {
    const secret = decryptTotpSecret(admin.totpSecretEncrypted);
    console.log('decryptWithCurrentKey: success', Boolean(secret));
  } catch (error) {
    console.log('decryptWithCurrentKey: failed', error.name || error.message);
  }
};

diagnose()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
