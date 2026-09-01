import crypto from 'crypto';
import config from '../config/index.js';
import ApiError from './ApiError.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const PROBE_PLAINTEXT = '__totp_encryption_probe__';

export class TotpDecryptionError extends Error {
  constructor(cause) {
    super('TOTP_DECRYPTION_FAILED');
    this.name = 'TotpDecryptionError';
    this.cause = cause;
  }
}

const getEncryptionKeyMaterial = () => {
  const secret = config.totp.encryptionKey;

  if (!secret) {
    throw new Error(
      'TOTP encryption key is not configured. Set TOTP_ENCRYPTION_KEY (recommended) or JWT_SECRET.',
    );
  }

  return secret;
};

const getEncryptionKey = () =>
  crypto.createHash('sha256').update(getEncryptionKeyMaterial()).digest();

export const validateTotpEncryptionConfig = () => {
  const keyMaterial = getEncryptionKeyMaterial();

  if (keyMaterial.length < 8) {
    throw new Error(
      'TOTP encryption key is too short. Use at least 32 random characters.',
    );
  }

  if (config.env === 'production' && keyMaterial.length < 32) {
    throw new Error(
      'Production TOTP encryption key must be at least 32 characters.',
    );
  }

  if (
    config.env === 'production' &&
    (keyMaterial === 'your_secret' || keyMaterial === 'changeme')
  ) {
    throw new Error(
      'Production TOTP encryption key must not use a placeholder value.',
    );
  }

  const probeCiphertext = encryptTotpSecret(PROBE_PLAINTEXT);
  const recovered = decryptTotpSecret(probeCiphertext);

  if (recovered !== PROBE_PLAINTEXT) {
    throw new Error('TOTP encryption self-test failed');
  }

  const source = config.totp.encryptionKeySource;
  console.log(
    `TOTP encryption ready (key source: ${source}, length: ${keyMaterial.length} chars)`,
  );
};

export const encryptTotpSecret = (plainSecret) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainSecret, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptTotpSecret = (encryptedValue) => {
  if (!encryptedValue) {
    return null;
  }

  const parts = encryptedValue.split(':');

  if (parts.length !== 3) {
    throw new TotpDecryptionError(new Error('Invalid encrypted TOTP format'));
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new TotpDecryptionError(new Error('Invalid encrypted TOTP format'));
  }

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      getEncryptionKey(),
      Buffer.from(ivHex, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    throw new TotpDecryptionError(error);
  }
};

export const decryptTotpSecretOrThrow = (encryptedValue) => {
  try {
    return decryptTotpSecret(encryptedValue);
  } catch (error) {
    if (error instanceof TotpDecryptionError) {
      console.error(
        'Admin TOTP secret could not be decrypted. The encryption key may have changed since 2FA was enabled. Run: npm run admin:reset-totp',
      );
      throw new ApiError(
        503,
        'Two-factor authentication cannot be verified because the server encryption key changed since 2FA was set up. Ask your administrator to reset 2FA and enroll again.',
      );
    }

    throw error;
  }
};
