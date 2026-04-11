/**
 * AUDIT LOGGING SYSTEM
 * Production-ready audit trail for security events and user actions
 * All sensitive operations are logged for compliance and investigation
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

/**
 * Audit event types
 */
export type AuditEventType =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_REGISTER"
  | "AUTH_OTP_SENT"
  | "AUTH_OTP_VERIFIED"
  | "AUTH_PASSWORD_CHANGED"
  | "AUTH_PASSWORD_RESET_REQUESTED"
  | "AUTH_FAILED_LOGIN"
  | "AUTH_ACCOUNT_LOCKED"
  | "PROFILE_UPDATED"
  | "PROFILE_DELETED"
  | "SESSION_CREATED"
  | "SESSION_CANCELLED"
  | "SESSION_BOOKING"
  | "DATA_EXPORTED"
  | "DATA_DELETED"
  | "ADMIN_ACTION"
  | "SECURITY_ALERT"
  | "RATE_LIMIT_EXCEEDED"
  | "SUSPICIOUS_ACTIVITY";

/**
 * Severity levels for audit events
 */
export type AuditSeverity = "info" | "warning" | "critical";

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  id?: string;
  timestamp: string;
  userId?: string;
  email?: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  action: string;
  description: string;
  ip: string;
  userAgent?: string;
  resourceType?: string; // e.g., "session", "profile", "note"
  resourceId?: string;   // ID of affected resource
  success: boolean;
  statusCode?: number;
  errorDetails?: string;
  metadata?: Record<string, any>; // Additional context
}

/**
 * ✅ SECURE: Create audit log entry
 * 
 * @param entry Audit log data
 * @returns Recorded audit entry or null if error
 */
export async function auditLog(entry: AuditLogEntry): Promise<AuditLogEntry | null> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Ensure audit_logs table exists with proper schema
    const auditEntry = {
      id: entry.id || crypto.randomUUID(),
      timestamp: entry.timestamp || new Date().toISOString(),
      user_id: entry.userId,
      email: entry.email,
      event_type: entry.eventType,
      severity: entry.severity,
      action: entry.action,
      description: entry.description,
      ip_address: entry.ip,
      user_agent: entry.userAgent,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      success: entry.success,
      status_code: entry.statusCode,
      error_details: entry.errorDetails,
      metadata: entry.metadata || {},
    };

    // Insert audit log record
    const { data, error } = await supabase
      .from("audit_logs")
      .insert(auditEntry)
      .select()
      .single();

    if (error) {
      console.error("[AUDIT] Failed to record audit log:", error.message);
      // Still log to console as fallback
      console.warn("[AUDIT-CONSOLE]", JSON.stringify(entry));
      return null;
    }

    return entry;
  } catch (e: any) {
    console.error("[AUDIT] Audit logging error:", e.message);
    // Don't let logging errors break the application
    return null;
  }
}

/**
 * ✅ SECURE: Log authentication events
 */
export async function auditAuthEvent(
  eventType: "AUTH_LOGIN" | "AUTH_LOGOUT" | "AUTH_REGISTER" | "AUTH_FAILED_LOGIN" | "AUTH_OTP_VERIFIED",
  params: {
    userId?: string;
    email?: string;
    ip: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
  }
): Promise<void> {
  const severityMap: Record<string, AuditSeverity> = {
    AUTH_LOGIN: "info",
    AUTH_LOGOUT: "info",
    AUTH_REGISTER: "info",
    AUTH_FAILED_LOGIN: "warning",
    AUTH_OTP_VERIFIED: "info",
  };

  await auditLog({
    timestamp: new Date().toISOString(),
    userId: params.userId,
    email: params.email,
    eventType,
    severity: severityMap[eventType] || "info",
    action: eventType,
    description: `${eventType}: ${params.email} from ${params.ip}`,
    ip: params.ip,
    userAgent: params.userAgent,
    success: params.success,
    errorDetails: params.reason,
  });
}

/**
 * ✅ SECURE: Log security alerts
 */
export async function auditSecurityAlert(
  severity: AuditSeverity,
  params: {
    userId?: string;
    email?: string;
    ip: string;
    userAgent?: string;
    reason: string;
    attemptCount?: number;
  }
): Promise<void> {
  await auditLog({
    timestamp: new Date().toISOString(),
    userId: params.userId,
    email: params.email,
    eventType: "SECURITY_ALERT",
    severity,
    action: "SECURITY_ALERT",
    description: params.reason,
    ip: params.ip,
    userAgent: params.userAgent,
    success: false,
    metadata: {
      attemptCount: params.attemptCount,
    },
  });
}

/**
 * ✅ SECURE: Log rate limit exceeded
 */
export async function auditRateLimit(
  ip: string,
  endpoint: string,
  limitType: string,
  params?: { userId?: string; email?: string }
): Promise<void> {
  await auditLog({
    timestamp: new Date().toISOString(),
    userId: params?.userId,
    email: params?.email,
    eventType: "RATE_LIMIT_EXCEEDED",
    severity: "warning",
    action: "RATE_LIMIT_EXCEEDED",
    description: `Rate limit exceeded: ${limitType} on ${endpoint} from ${ip}`,
    ip,
    success: false,
    metadata: {
      endpoint,
      limitType,
    },
  });
}

/**
 * ✅ SECURE: Log data operations
 */
export async function auditDataOperation(
  operation: "DATA_EXPORTED" | "DATA_DELETED",
  params: {
    userId: string;
    resourceType: string;
    resourceId: string;
    ip: string;
    userAgent?: string;
  }
): Promise<void> {
  await auditLog({
    timestamp: new Date().toISOString(),
    userId: params.userId,
    eventType: operation,
    severity: "warning",
    action: operation,
    description: `User ${params.userId} performed ${operation} on ${params.resourceType}`,
    ip: params.ip,
    userAgent: params.userAgent,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    success: true,
  });
}

/**
 * Utility to extract client IP from Hono context
 */
export function getClientIP(headers: Record<string, string>, remoteAddr?: string): string {
  // Check X-Forwarded-For header (proxy/CDN)
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cloudflareIP = headers["cf-connecting-ip"];
  if (cloudflareIP) {
    return cloudflareIP;
  }

  // Check X-Real-IP (nginx)
  const realIP = headers["x-real-ip"];
  if (realIP) {
    return realIP;
  }

  // Fallback to remote address
  return remoteAddr || "0.0.0.0";
}

/**
 * Create audit log table migration (run once)
 * This ensures the audit_logs table exists with proper schema
 */
export async function createAuditLogsTable(): Promise<void> {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if table exists
    const { data: tables, error: listError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "audit_logs");

    if (!listError && tables && tables.length > 0) {
      console.log("[AUDIT] audit_logs table already exists");
      return;
    }

    // Create table if it doesn't exist
    const { error } = await supabase.rpc("create_audit_logs_table");

    if (error && !error.message.includes("already exists")) {
      console.error("[AUDIT] Failed to create audit_logs table:", error.message);
    } else {
      console.log("[AUDIT] audit_logs table created successfully");
    }
  } catch (e: any) {
    console.error("[AUDIT] Error during table creation check:", e.message);
  }
}
