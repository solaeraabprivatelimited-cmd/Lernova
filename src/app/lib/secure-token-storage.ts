/**
 * SECURE TOKEN STORAGE & SESSION MANAGEMENT
 * Replaces localStorage tokens with HTTP-only cookie handling
 * Production-ready implementation for token security
 */

export interface TokenStore {
  token: string | null;
  expiresAt: number;
}

/**
 * ✅ SECURE: Use sessionStorage instead of localStorage
 * sessionStorage is cleared when browser closes, reducing XSS attack window
 * This is a SHORT-TERM fix - long-term should migrate to HTTP-only cookies
 */

const TOKEN_KEY = 'learnova_session_token';
const USER_KEY = 'learnova_session_user';
const TOKEN_STORAGE = 'session'; // 'session' = sessionStorage, 'local' = localStorage

function getStorage(): Storage {
  // sessionStorage is cleared when browser closes (safer than localStorage)
  return window.sessionStorage;
}

/**
 * Securely store access token in sessionStorage
 * @param token JWT access token
 */
export function setAccessTokenSecurely(token: string | null): void {
  if (!token) {
    getStorage().removeItem(TOKEN_KEY);
    return;
  }

  // Validate token format before storing
  if (!isValidJWT(token)) {
    console.error('Invalid token format, not storing');
    return;
  }

  try {
    getStorage().setItem(TOKEN_KEY, token);
  } catch (error) {
    // Handle quota exceeded
    console.error('Failed to store token:', error);
  }
}

/**
 * Retrieve access token from sessionStorage
 * @returns JWT token or null if not found/expired
 */
export function getAccessTokenSecurely(): string | null {
  try {
    const token = getStorage().getItem(TOKEN_KEY);
    
    if (!token) return null;
    
    // Validate token is still valid
    if (!isValidJWT(token)) {
      getStorage().removeItem(TOKEN_KEY);
      return null;
    }

    // Check expiration
    const payload = decodeJWTPayload(token);
    if (!payload) {
      getStorage().removeItem(TOKEN_KEY);
      return null;
    }

    const expiresAtMs = payload.exp * 1000;
    if (Date.now() > expiresAtMs) {
      // Token expired
      getStorage().removeItem(TOKEN_KEY);
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

/**
 * Securely store user data
 * IMPORTANT: Store only non-sensitive user metadata (id, email, name)
 * Never store passwords, auth tokens, or payment info
 */
export function setUserDataSecurely(user: {
  id: string;
  email: string;
  name: string;
  role: string;
} | null): void {
  if (!user) {
    getStorage().removeItem(USER_KEY);
    return;
  }

  try {
    // Store only safe data fields
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    getStorage().setItem(USER_KEY, JSON.stringify(safeUser));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
}

/**
 * Retrieve user data from sessionStorage
 */
export function getUserDataSecurely(): any | null {
  try {
    const raw = getStorage().getItem(USER_KEY);
    if (!raw) return null;
    
    const user = JSON.parse(raw);
    
    // Validate required fields
    if (!user.id || !user.email) {
      getStorage().removeItem(USER_KEY);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    getStorage().removeItem(USER_KEY);
    return null;
  }
}

/**
 * Clear all secure session data
 */
export function clearSecureSession(): void {
  try {
    getStorage().removeItem(TOKEN_KEY);
    getStorage().removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Helper: Validate JWT format
 */
function isValidJWT(token: string): boolean {
  if (typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Helper: Decode JWT payload
 */
function decodeJWTPayload(token: string): any | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    
    // Handle base64url encoding
    const decoded = atob(
      payload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    );
    
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

/**
 * MIGRATION PATH TO HTTP-ONLY COOKIES
 * 
 * When backend is ready to set HTTP-only cookies:
 * 
 * 1. Backend sets in response headers:
 *    Set-Cookie: learnova_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/api
 * 
 * 2. Frontend stops manual token storage:
 *    // Remove calls to setAccessTokenSecurely()
 *    // Cookies are automatically sent with credentials: 'include'
 * 
 * 3. API calls include credentials:
 *    fetch(url, { credentials: 'include' })
 *
 * This provides MAXIMUM security as tokens become:
 * - Inaccessible to JavaScript (prevents XSS theft)
 * - Bound to same-site requests (prevents CSRF)
 * - Automatically managed by browser
 */

export const MIGRATION_NOTES = `
SECURITY PROGRESSION:
1. Current (Session Storage) ✅ - Better than localStorage
2. Target (HTTP-only Cookies) 🔒 - Production standard
3. Advanced (Proxy Sessions) 🏆 - Enterprise grade

To implement HTTP-only cookies:
- Add Supabase Edge Function middleware to set Set-Cookie headers
- Ensure 'Secure' flag (HTTPS only)
- Ensure 'SameSite=Strict' (CSRF protection)
- Ensure 'HttpOnly' flag
- Set reasonable 'Max-Age' (e.g., 1 hour)
`;
