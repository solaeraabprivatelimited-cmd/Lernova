/**
 * RATE LIMITING & SECURITY UTILITIES
 * Production-ready rate limiting with Redis/KV store backend
 * Prevents brute force attacks, DoS, and abuse
 */

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints
  otp_send: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 3 per hour per email
    skipSuccessfulRequests: false,
  },
  
  otp_verify: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 per 15 minutes per email
    skipSuccessfulRequests: false,
  },
  
  login: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 10 per 15 minutes per email
    skipSuccessfulRequests: true, // Don't count successful attempts
  },
  
  password_reset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 3 per hour per email
    skipSuccessfulRequests: false,
  },
  
  profile_update: {
    maxRequests: 50,
    windowMs: 60 * 60 * 1000, // 50 per hour per user
    skipSuccessfulRequests: true,
  },
  
  global_ip: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000, // 1000 requests per hour per IP
    skipSuccessfulRequests: false,
  },
};

/**
 * Rate limit store interface
 * Implement with Redis, Memcached, or KV store
 */
export interface RateLimitStore {
  get(key: string): Promise<RateLimitData | null>;
  set(key: string, data: RateLimitData, expirySeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface RateLimitData {
  count: number;
  resetAt: number;
  lastAttempt: number;
}

/**
 * Unified rate limiter class
 */
export class RateLimiter {
  constructor(private store: RateLimitStore) {}

  /**
   * Check if request is within rate limit
   * @param identifier Unique identifier (email, IP, user ID, etc)
   * @param limitName Rate limit config key
   * @returns { allowed: boolean, retryAfter?: number }
   */
  async checkLimit(
    identifier: string,
    limitName: keyof typeof RATE_LIMIT_CONFIG,
    skipIfSuccess?: boolean
  ): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
    
    const config = RATE_LIMIT_CONFIG[limitName];
    const key = `ratelimit:${limitName}:${identifier}`;
    const now = Date.now();

    try {
      let data = await this.store.get(key);

      // Initialize if first request
      if (!data) {
        await this.store.set(key, {
          count: 1,
          resetAt: now + config.windowMs,
          lastAttempt: now,
        }, Math.ceil(config.windowMs / 1000));
        
        return { allowed: true };
      }

      // Reset window if expired
      if (now > data.resetAt) {
        await this.store.set(key, {
          count: 1,
          resetAt: now + config.windowMs,
          lastAttempt: now,
        }, Math.ceil(config.windowMs / 1000));
        
        return { allowed: true };
      }

      // Check if limit exceeded
      if (data.count >= config.maxRequests) {
        const retryAfter = Math.ceil((data.resetAt - now) / 1000);
        return {
          allowed: false,
          retryAfterSeconds: retryAfter,
        };
      }

      // Increment counter
      await this.store.set(key, {
        count: data.count + 1,
        resetAt: data.resetAt,
        lastAttempt: now,
      }, Math.ceil((data.resetAt - now) / 1000));

      return { allowed: true };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open (allow request) if store fails
      return { allowed: true };
    }
  }

  /**
   * Reset rate limit for identifier (e.g., after email verification)
   */
  async reset(identifier: string, limitName: keyof typeof RATE_LIMIT_CONFIG): Promise<void> {
    const key = `ratelimit:${limitName}:${identifier}`;
    await this.store.delete(key);
  }

  /**
   * Get current request count without incrementing
   */
  async getCount(
    identifier: string,
    limitName: keyof typeof RATE_LIMIT_CONFIG
  ): Promise<number> {
    const key = `ratelimit:${limitName}:${identifier}`;
    const data = await this.store.get(key);
    return data?.count ?? 0;
  }
}

/**
 * Deno KV Store implementation (for Supabase Edge Functions)
 */
export class DenoKVRateLimitStore implements RateLimitStore {
  constructor(private kv: any) {} // Deno KV instance

  async get(key: string): Promise<RateLimitData | null> {
    try {
      const value = await this.kv.get(key);
      return value.value as RateLimitData | null;
    } catch {
      return null;
    }
  }

  async set(key: string, data: RateLimitData, expirySeconds: number): Promise<void> {
    await this.kv.set(key, data, { ex: expirySeconds });
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
}

/**
 * Get client IP from Cloudflare or standard headers
 * Works in Cloudflare Workers and Supabase Edge Functions
 */
export function getClientIP(headers: Record<string, string>): string {
  // Cloudflare Workers
  if (headers['cf-connecting-ip']) {
    return headers['cf-connecting-ip'];
  }

  // Standard proxies
  if (headers['x-forwarded-for']) {
    return headers['x-forwarded-for'].split(',')[0].trim();
  }

  if (headers['x-real-ip']) {
    return headers['x-real-ip'];
  }

  return 'unknown';
}

/**
 * Create rate limit middleware for Hono
 */
export function createRateLimitMiddleware(
  limiter: RateLimiter,
  limitName: keyof typeof RATE_LIMIT_CONFIG,
  getIdentifier: (context: any) => string
) {
  return async (c: any, next: Function) => {
    const identifier = getIdentifier(c);
    
    const limit = await limiter.checkLimit(identifier, limitName);

    if (!limit.allowed) {
      return c.json(
        {
          error: `Too many requests. Please try again in ${limit.retryAfterSeconds} seconds.`,
          retryAfter: limit.retryAfterSeconds,
        },
        429 // Too Many Requests
      );
    }

    // Add headers for client
    c.header('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG[limitName].maxRequests));
    c.header('X-RateLimit-Remaining', String(
      RATE_LIMIT_CONFIG[limitName].maxRequests - await limiter.getCount(identifier, limitName)
    ));

    await next();
  };
}
