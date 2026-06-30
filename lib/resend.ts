import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  goal: string;
  message: string;
}

/** Sends an email notification to the admin when a new contact form is submitted. */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";

  await resend.emails.send({
    from: "Arisa Nutrition <noreply@arisanutrition.com>",
    to: adminEmail,
    replyTo: data.email,
    subject: `New Contact Request from ${data.name}`,
    html: buildContactEmailHtml(data),
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
