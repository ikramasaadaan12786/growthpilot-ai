import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 16;

/**
 * Derives a 32-byte key from the secret and salt using PBKDF2
 */
function getKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts a string using AES-256-GCM.
 * Output format: salt:iv:authTag:encryptedData (hex encoded)
 */
export function encryptToken(plainText: string, secretKey?: string): string {
  if (!plainText) return '';
  const secret = secretKey || process.env.NEXTAUTH_SECRET || 'growthpilot_default_secure_secret_key_32bytes';
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey(secret, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 */
export function decryptToken(cipherText: string, secretKey?: string): string {
  if (!cipherText) return '';
  // If not in encrypted format (e.g. unencrypted mock), return plain text safely
  if (!cipherText.includes(':')) return cipherText;

  try {
    const parts = cipherText.split(':');
    if (parts.length !== 4) return cipherText;

    const [saltHex, ivHex, authTagHex, encryptedData] = parts;
    const secret = secretKey || process.env.NEXTAUTH_SECRET || 'growthpilot_default_secure_secret_key_32bytes';
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const key = getKey(secret, salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Decryption failed, token may be corrupt or secret mismatch:', err);
    return '';
  }
}
