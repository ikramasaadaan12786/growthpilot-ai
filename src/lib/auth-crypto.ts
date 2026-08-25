import crypto from 'crypto';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY || 'growthpilot_super_secret_jwt_key_2026_growth_lead_ai';
const SALT_ROUNDS = 10000;
const KEY_LEN = 64;

/**
 * Hashes a plaintext password using cryptographic PBKDF2 with SHA-512
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LEN, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const computedHash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, KEY_LEN, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(originalHash, 'hex'));
}

/**
 * Creates a signed JWT session token
 */
export function createSessionToken(payload: {
  userId: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
}): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies a signed JWT session token
 */
export function verifySessionToken(token: string): {
  userId: string;
  email: string;
  name: string;
  role: string;
  plan?: string;
} | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role || 'USER',
      plan: payload.plan || 'FREE'
    };
  } catch {
    return null;
  }
}
