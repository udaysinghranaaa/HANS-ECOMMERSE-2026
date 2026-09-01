import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const BACKUP_CODE_COUNT = 8;

const generateBackupCode = () => {
  const partA = crypto.randomBytes(2).toString('hex').toUpperCase();
  const partB = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${partA}-${partB}`;
};

export const generateBackupCodes = async () => {
  const plainCodes = Array.from({ length: BACKUP_CODE_COUNT }, () =>
    generateBackupCode(),
  );
  const hashedCodes = await Promise.all(
    plainCodes.map((code) => bcrypt.hash(code, 12)),
  );

  return { plainCodes, hashedCodes };
};

export const verifyBackupCode = async (inputCode, hashedCodes) => {
  const normalized = inputCode.trim().toUpperCase();

  for (let index = 0; index < hashedCodes.length; index += 1) {
    const isMatch = await bcrypt.compare(normalized, hashedCodes[index]);

    if (isMatch) {
      return index;
    }
  }

  return -1;
};
