import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const resetAdminTotp = async () => {
  const emailArg = process.argv[2]?.trim().toLowerCase();
  const email = emailArg || process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      'Provide an admin email argument or set ADMIN_EMAIL in the environment.',
    );
  }

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin) {
    throw new Error(`No admin account found for ${email}`);
  }

  if (!admin.totpEnabled && !admin.totpSecretEncrypted) {
    console.log(`2FA is already cleared for ${email}.`);
    return;
  }

  await prisma.admin.update({
    where: { email },
    data: {
      totpSecretEncrypted: null,
      totpEnabled: false,
      backupCodesHashed: [],
    },
  });

  console.log(`2FA reset complete for ${email}.`);
  console.log('Next steps:');
  console.log('1. Ensure TOTP_ENCRYPTION_KEY is set to a stable value on every server instance.');
  console.log('2. Sign in with email and password.');
  console.log('3. Scan the new QR code and complete 2FA setup again.');
};

resetAdminTotp()
  .catch((error) => {
    console.error('Admin 2FA reset failed:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
