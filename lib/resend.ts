import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export default getResend;

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  goal: string;
  message: string;
}

/** Sends an email notification to the admin and a confirmation email to the submitter. */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";

  // Send notification to admin
  await getResend().emails.send({
    from: "aadiba@arisanutrition.com",
    to: adminEmail,
    replyTo: data.email,
    subject: `New Contact Request from ${data.name}`,
    html: buildContactEmailHtml(data),
  });

  // Send confirmation to submitter
  await getResend().emails.send({
    from: "aadiba@arisanutrition.com",
    to: data.email,
    subject: "We received your contact request",
    html: buildConfirmationEmailHtml(data),
  });
}

function buildContactEmailHtml(data: ContactEmailData): string {
  const e = escapeHtml;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Request</title>
      <style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);}
        .header{background:#2e7d32;padding:24px;color:#fff;text-align:center;}
        .header h1{margin:0;font-size:24px;}
        .body{padding:32px;}
        .field{margin-bottom:16px;}
        .label{font-weight:bold;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:.5px;}
        .value{margin:4px 0 0;font-size:16px;color:#222;}
        .msg-box{background:#f9f9f9;border-left:4px solid #2e7d32;padding:16px;margin-top:8px;border-radius:4px;white-space:pre-wrap;}
        .footer{background:#f4f4f4;padding:16px;text-align:center;font-size:12px;color:#999;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Request</h1>
          <p style="margin:8px 0 0;opacity:.8;">Arisa Nutrition Website</p>
        </div>
        <div class="body">
          <div class="field"><p class="label">Name</p><p class="value">${e(data.name)}</p></div>
          <div class="field"><p class="label">Email</p><p class="value">${e(data.email)}</p></div>
          <div class="field"><p class="label">Phone</p><p class="value">${e(data.phone)}</p></div>
          <div class="field"><p class="label">Goal</p><p class="value">${e(data.goal)}</p></div>
          <div class="field">
            <p class="label">Message</p>
            <div class="msg-box">${e(data.message)}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was generated automatically from the Arisa Nutrition contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildConfirmationEmailHtml(data: ContactEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Contact Request Received</title>
      <style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);}
        .header{background:#2e7d32;padding:24px;color:#fff;text-align:center;}
        .header h1{margin:0;font-size:24px;}
        .body{padding:32px;line-height:1.6;color:#333;}
        .body p{margin:16px 0;}
        .footer{background:#f4f4f4;padding:16px;text-align:center;font-size:12px;color:#999;}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You!</h1>
          <p style="margin:8px 0 0;opacity:.8;">Your message has been received</p>
        </div>
        <div class="body">
          <p>Hi ${escapeHtml(data.name)},</p>
          <p>Thank you for reaching out to Arisa Nutrition! We have received your contact request and appreciate you taking the time to connect with us.</p>
          <p>Our team will review your message and get back to you as soon as possible at <strong>${escapeHtml(data.email)}</strong>.</p>
          <p>If you have any urgent questions, please feel free to reach out directly.</p>
          <p>Best regards,<br><strong>Arisa Nutrition Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
