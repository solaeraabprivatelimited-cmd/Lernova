/**
 * SECURITY HEADERS & MIDDLEWARE
 * Production-ready security headers and CORS configuration
 * Protects against XSS, clickjacking, MIME sniffing, etc.
 */

/**
 * Get production-grade security headers
 * Configurable based on environment and domain
 */
export function getSecurityHeaders(options = {}): Record<string, string> {
  const allowedDomains = [
    'https://elmorbit.co.in',
    'https://www.elmorbit.co.in',
    'https://app.elmorbit.co.in',
  ];

  const supabaseUrl = 'https://evtvzmherkrahjsxdddi.supabase.co';

  return {
    // ========================================================================
    // Content Security Policy (CSP)
    // Prevents XSS by restricting script, style, image, and other resource sources
    // ========================================================================
    'Content-Security-Policy': [
      // Default: only same-origin
      "default-src 'self'",
      
      // Scripts: same-origin + wasm (React requires wasm-unsafe-eval)
      "script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net",
      
      // Styles: same-origin + inline (Tailwind uses inline styles)
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      
      // Images: same-origin + data URIs + https
      "img-src 'self' https: data: blob:",
      
      // Fonts: same-origin + CDNs
      "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
      
      // API connections: same-origin only (strict)
      `connect-src 'self' ${supabaseUrl}`,
      
      // Prevent embedding in iframes (clickjacking protection)
      "frame-ancestors 'none'",
      
      // Upgrade insecure requests to HTTPS
      "upgrade-insecure-requests",
      
      // Media: same-origin
      "media-src 'self'",
      
      // Forms: same-origin only
      "form-action 'self'",
      
      // Report CSP violations (optional)
      // "report-uri /api/csp-report",
    ].join('; '),

    // ========================================================================
    // MIME Type Protection
    // Prevents browser from guessing content types (X-Content-Type-Options: nosniff)
    // ========================================================================
    'X-Content-Type-Options': 'nosniff',

    // ========================================================================
    // Clickjacking Protection (X-Frame-Options)
    // DENY: Cannot be embedded in iframes anywhere
    // SAMEORIGIN: Can only be embedded on same origin
    // ALLOW-FROM url: Can only be embedded on specific URL
    // ========================================================================
    'X-Frame-Options': 'DENY',

    // ========================================================================
    // Strict Transport Security (HSTS)
    // Forces HTTPS connections, prevents SSL stripping
    // max-age: How long to remember this header (31536000 = 1 year)
    // includeSubDomains: Apply to subdomains too
    // preload: Allow inclusion in HSTS preload lists
    // ========================================================================
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // ========================================================================
    // Referrer Policy
    // Controls what referrer information is sent with requests
    // strict-origin-when-cross-origin: Send origin only for cross-origin requests
    // ========================================================================
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // ========================================================================
    // XSS Protection (Legacy, for older browsers)
    // Modern browsers ignore this, but helpful for IE11
    // ========================================================================
    'X-XSS-Protection': '1; mode=block',

    // ========================================================================
    // Permissions Policy (formerly Feature Policy)
    // Restricts dangerous browser APIs
    // ========================================================================
    'Permissions-Policy': [
      'camera=()',              // Disable camera access
      'microphone=()',          // Disable microphone access
      'geolocation=()',         // Disable geolocation
      'payment=()',             // Disable payment API
      'usb=()',                 // Disable USB API
      'accelerometer=()',       // Disable accelerometer
      'gyroscope=()',           // Disable gyroscope
      'magnetometer=()',        // Disable magnetometer
      'vr=()',                  // Disable VR
      'xr-spatial-tracking=()', // Disable spatial tracking
    ].join(', '),

    // ========================================================================
    // Cache Control
    // Prevent caching of sensitive responses
    // ========================================================================
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',

    // ========================================================================
    // Additional Headers
    // ========================================================================
    'X-Permitted-Cross-Domain-Policies': 'none',  // Disable cross-domain policy
    'Cross-Origin-Opener-Policy': 'same-origin',  // Prevent window.opener access
    'Cross-Origin-Resource-Policy': 'same-origin', // Restrict resource access
  };
}

/**
 * CORS configuration
 * Strict, production-ready CORS setup
 */
export const corsConfig = {
  origin: (origin: string | undefined) => {
    const allowedOrigins = [
      'https://elmorbit.co.in',
      'https://www.elmorbit.co.in',
      'https://app.elmorbit.co.in',
      // Add additional allowed origins for dev/staging
      ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
    ];

    // Allow requests without origin (same-origin requests, postman, etc)
    if (!origin) {
      return true;
    }

    if (allowedOrigins.includes(origin)) {
      return origin;
    }

    return false; // Reject request
  },
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  exposeHeaders: [
    'Content-Length',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  credentials: true,  // Allow cookies to be sent with requests
  maxAge: 600,        // Max age for preflight cache
};

/**
 * Apply security headers middleware
 * For Hono framework
 */
export function securityHeadersMiddleware() {
  return async (c: any, next: any) => {
    // Add security headers to response
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      c.header(key, value);
    });

    await next();
  };
}

/**
 * Create CSRF token
 * Use this to create tokens for state-changing operations
 */
export function generateCSRFToken(): string {
  // Use crypto.getRandomValues for secure random
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token
 * Compare token from request header with expected token
 */
export function validateCSRFToken(headerToken: string, sessionToken: string): boolean {
  if (!headerToken || !sessionToken) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(headerToken, sessionToken);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks on token validation
 */
function timingSafeEqual(a: string, b: string): boolean {
  const bufferA = new TextEncoder().encode(a);
  const bufferB = new TextEncoder().encode(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < bufferA.length; i++) {
    result |= bufferA[i] ^ bufferB[i];
  }

  return result === 0;
}

/**
 * Security headers for different response types
 */
export const headerVariants = {
  // For API responses (JSON)
  api: {
    ...getSecurityHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
  },

  // For HTML responses
  html: {
    ...getSecurityHeaders(),
    'Content-Type': 'text/html; charset=utf-8',
  },

  // For file downloads (PDFs, etc)
  download: {
    ...getSecurityHeaders(),
    'Content-Disposition': 'attachment',
    'X-Content-Type-Options': 'nosniff',
  },
};
