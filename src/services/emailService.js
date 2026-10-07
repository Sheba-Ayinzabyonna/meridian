/**
 * Email Service Integration Guide
 * Prepare for sending plans via email (Resend, SendGrid, or similar)
 */

/**
 * Example: Send plan via email using Resend API
 * This is a reference implementation for Phase 2
 */

export async function sendPlanViaEmail(email, plan, userName = 'Friend') {
  const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn('VITE_RESEND_API_KEY not configured. Email not sent.');
    // In MVP, this is optional
    return { success: false, reason: 'Email service not configured' };
  }

  try {
    // This would be called from a backend endpoint, not directly from frontend
    // The frontend should send email to backend, which handles the API key

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        userName,
        plan,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Backend Endpoint Example (Node.js/Express)
 * 
 * This would live in your backend, not in the frontend
 * 
 * POST /api/send-email
 * 
 * import { Resend } from 'resend';
 * const resend = new Resend(process.env.RESEND_API_KEY);
 * 
 * app.post('/api/send-email', async (req, res) => {
 *   const { email, userName, plan } = req.body;
 * 
 *   try {
 *     const response = await resend.emails.send({
 *       from: 'hello@meridian.app',
 *       to: email,
 *       subject: `Your 30/60/90 Career Transition Plan is Ready ✨`,
 *       html: buildPlanEmailHTML(userName, plan),
 *     });
 * 
 *     res.json({ success: true, id: response.id });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 */

/**
 * Build HTML email template
 */
export function buildPlanEmailHTML(userName, plan) {
  const { thirtyDays, sixtyDays, ninetyDays } = plan;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Inter, sans-serif; color: #1f2937; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #0D4F5C; color: white; padding: 40px 20px; text-align: center; }
          .section { margin: 30px 0; padding: 20px; background: #f8f4ec; border-radius: 8px; }
          .action { color: #0D4F5C; font-weight: 600; margin: 10px 0; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
          .button { background: #C9A84C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 24px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-family: 'Playfair Display', serif;">Meridian</h1>
            <p style="margin: 10px 0 0; font-style: italic;">Your 30/60/90 Day Career Transition Plan</p>
          </div>

          <div style="padding: 20px;">
            <p>Hi ${userName},</p>
            <p>Your personalized career transition plan is ready! Here's what the next 90 days look like:</p>

            <div class="section">
              <h2 style="margin-top: 0; color: #0D4F5C;">${thirtyDays.title}</h2>
              <p>${thirtyDays.description}</p>
              <ul>
                ${thirtyDays.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            <div class="section">
              <h2 style="margin-top: 0; color: #0D4F5C;">${sixtyDays.title}</h2>
              <p>${sixtyDays.description}</p>
              <ul>
                ${sixtyDays.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            <div class="section">
              <h2 style="margin-top: 0; color: #0D4F5C;">${ninetyDays.title}</h2>
              <p>${ninetyDays.description}</p>
              <ul>
                ${ninetyDays.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://meridian.app/check-in" class="button">Start Your Daily Check-In</a>
            </div>

            <p style="color: #999; font-size: 14px;">
              Questions? Reply to this email or contact us at hello@meridian.app
            </p>
          </div>

          <div class="footer">
            <p>© 2026 Meridian. Your career transition, guided.</p>
            <p>Unsubscribe | Update preferences</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Resend Environment Variables (for backend)
 * 
 * Add to your backend .env:
 * RESEND_API_KEY=re_xxxxxxxxxxxx
 * 
 * Or use SendGrid:
 * SENDGRID_API_KEY=SG.xxxxxxxxxxxx
 * 
 * Or Mailgun:
 * MAILGUN_API_KEY=key-xxxxxxxxxxxx
 * MAILGUN_DOMAIN=mg.meridian.app
 */

export const EMAIL_PROVIDERS = {
  RESEND: 'resend',
  SENDGRID: 'sendgrid',
  MAILGUN: 'mailgun',
  CUSTOM: 'custom',
};
