/**
 * Notification Service
 * Handles email, SMS, and webhook notifications for alerts
 * 
 * Requires environment variables:
 * - SENDGRID_API_KEY: SendGrid API key for email
 * - TWILIO_ACCOUNT_SID: Twilio account SID for SMS
 * - TWILIO_AUTH_TOKEN: Twilio auth token
 * - TWILIO_PHONE_NUMBER: Twilio phone number to send SMS from
 */

interface AlertPayload {
  roomId: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  timestamp: string;
  recipientEmail?: string;
  recipientPhone?: string;
  webhookUrl?: string;
}

// ============ EMAIL NOTIFICATIONS (SendGrid) ============
export async function sendEmailAlert(alert: AlertPayload, recipientEmail: string) {
  const apiKey = import.meta.env.VITE_SENDGRID_API_KEY || process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ SendGrid API key not configured. Email notifications disabled.');
    return;
  }

  try {
    const emailContent = `
      <h2>🚨 Study Room Alert</h2>
      <p><strong>Room ID:</strong> ${alert.roomId}</p>
      <p><strong>Event Type:</strong> ${alert.eventType}</p>
      <p><strong>Severity:</strong> <span style="color: ${getSeverityColor(alert.severity)}">${alert.severity.toUpperCase()}</span></p>
      <p><strong>Description:</strong> ${alert.description || 'N/A'}</p>
      <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
      <hr>
      <p><small>This is an automated alert from Lernova Study Room Monitoring</small></p>
    `;

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
            subject: `🚨 ${alert.severity.toUpperCase()} Alert: ${alert.eventType} in Room ${alert.roomId}`,
          },
        ],
        from: {
          email: 'alerts@lernova.app',
          name: 'Lernova Alerts',
        },
        content: [
          {
            type: 'text/html',
            value: emailContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    console.log('✅ Email alert sent successfully to:', recipientEmail);
    return { success: true, method: 'email', recipient: recipientEmail };
  } catch (error) {
    console.error('❌ Failed to send email alert:', error);
    return { success: false, method: 'email', error: String(error) };
  }
}

// ============ SMS NOTIFICATIONS (Twilio) ============
export async function sendSmsAlert(alert: AlertPayload, recipientPhone: string) {
  const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
  const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('⚠️ Twilio credentials not configured. SMS notifications disabled.');
    return;
  }

  try {
    const messageBody = `🚨 ALERT: ${alert.severity.toUpperCase()} - ${alert.eventType} in Room ${alert.roomId}. ${alert.description || ''} Check Lernova for details.`;

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: recipientPhone,
        Body: messageBody,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ SMS alert sent successfully to:', recipientPhone);
    return { success: true, method: 'sms', recipient: recipientPhone, messageId: result.sid };
  } catch (error) {
    console.error('❌ Failed to send SMS alert:', error);
    return { success: false, method: 'sms', error: String(error) };
  }
}

// ============ WEBHOOK NOTIFICATIONS ============
export async function sendWebhookAlert(alert: AlertPayload, webhookUrl: string) {
  if (!webhookUrl) {
    console.warn('⚠️ Webhook URL not provided. Webhook notification skipped.');
    return;
  }

  try {
    const payload = {
      source: 'lernova-monitoring',
      alert: {
        roomId: alert.roomId,
        eventType: alert.eventType,
        severity: alert.severity,
        description: alert.description,
        timestamp: alert.timestamp,
      },
      metadata: {
        sentAt: new Date().toISOString(),
        version: '1.0',
      },
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lernova-Monitoring/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook endpoint returned ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Webhook alert sent successfully to:', webhookUrl);
    return { success: true, method: 'webhook', url: webhookUrl };
  } catch (error) {
    console.error('❌ Failed to send webhook alert:', error);
    return { success: false, method: 'webhook', error: String(error) };
  }
}

// ============ MULTI-CHANNEL NOTIFICATION ============
export async function sendMultiChannelAlert(
  alert: AlertPayload,
  channels: Array<'email' | 'sms' | 'webhook'>,
  contacts: {
    email?: string;
    phone?: string;
    webhook?: string;
  }
) {
  const results = [];

  for (const channel of channels) {
    switch (channel) {
      case 'email':
        if (contacts.email) {
          const result = await sendEmailAlert(alert, contacts.email);
          results.push(result);
        }
        break;
      case 'sms':
        if (contacts.phone) {
          const result = await sendSmsAlert(alert, contacts.phone);
          results.push(result);
        }
        break;
      case 'webhook':
        if (contacts.webhook) {
          const result = await sendWebhookAlert(alert, contacts.webhook);
          results.push(result);
        }
        break;
    }
  }

  const successCount = results.filter(r => r?.success).length;
  console.log(`📊 Multi-channel alert: ${successCount}/${results.length} channels successful`);
  
  return results;
}

// ============ HELPER FUNCTIONS ============
function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return '#DC2626';
    case 'high':
      return '#F97316';
    case 'medium':
      return '#EAB308';
    case 'low':
      return '#3B82F6';
    default:
      return '#6B7280';
  }
}

export function formatAlertSummary(alert: AlertPayload): string {
  return `[${alert.severity.toUpperCase()}] ${alert.eventType} - Room ${alert.roomId}`;
}

export function createAlertPayload(
  roomId: string,
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  description?: string
): AlertPayload {
  return {
    roomId,
    eventType,
    severity,
    description,
    timestamp: new Date().toISOString(),
  };
}
