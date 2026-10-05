// Base HTML Shell for all emails
const getEmailShell = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #4f46e5; padding: 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; }
    .content { padding: 32px; color: #334155; line-height: 1.6; }
    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 13px; color: #64748b; }
    .btn { display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin: 16px 0; }
    .otp { font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #0f172a; text-align: center; margin: 24px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ScholarNest</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      Your campus marketplace.<br>
      © ${new Date().getFullYear()} ScholarNest. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const EMAIL_VERIFY_TEMPLATE = getEmailShell("Verify your email", `
  <h2 style="margin-top:0;">Verify your student email</h2>
  <p>Hi there,</p>
  <p>You're almost ready to join your campus marketplace. Use the verification code below to verify your email address: <span style="color:#4f46e5;font-weight:600;">{{email}}</span></p>
  <div class="otp">{{otp}}</div>
  <p style="font-size: 14px; color: #64748b;">This code is valid for 24 hours.</p>
`);

export const PASSWORD_RESET_TEMPLATE = getEmailShell("Reset your password", `
  <h2 style="margin-top:0;">Reset your password</h2>
  <p>Hi there,</p>
  <p>We received a request to reset the password for your account associated with <span style="color:#4f46e5;font-weight:600;">{{email}}</span>.</p>
  <p>Use the verification code below to securely reset your password:</p>
  <div class="otp">{{otp}}</div>
  <p style="font-size: 14px; color: #64748b;">This code is valid for 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
`);

export const WELCOME_TEMPLATE = getEmailShell("Welcome to ScholarNest", `
  <h2 style="margin-top:0;">Welcome to your campus marketplace!</h2>
  <p>Hi {{name}},</p>
  <p>We're thrilled to have you on ScholarNest. You can now buy and sell second-hand items safely with other students on your campus.</p>
  <p>Here are a few things you can do to get started:</p>
  <ul>
    <li>Complete your profile and add your major/year</li>
    <li>List textbooks, electronics, or dorm gear you no longer need</li>
    <li>Browse deals from other students</li>
  </ul>
  <center>
    <a href="{{frontend_url}}" class="btn">Explore the Marketplace</a>
  </center>
`);

export const LISTING_APPROVED_TEMPLATE = getEmailShell("Your listing is live!", `
  <h2 style="margin-top:0;">Your listing was approved!</h2>
  <p>Great news! Your listing <strong>"{{title}}"</strong> has been approved by our moderation team and is now live on the marketplace.</p>
  <p>Students can now view your listing and send you reservation requests or offers.</p>
`);

export const LISTING_REJECTED_TEMPLATE = getEmailShell("Action required on your listing", `
  <h2 style="margin-top:0;">Your listing needs a few edits</h2>
  <p>We reviewed your recent listing <strong>"{{title}}"</strong>, but unfortunately it doesn't quite meet our community guidelines yet.</p>
  <p><strong>Reason from moderation team:</strong><br>
  <span style="display:block;padding:12px;background:#fef2f2;border-left:4px solid #ef4444;margin-top:8px;">{{reason}}</span></p>
  <p>Please edit your listing to resolve these issues and we'll review it again!</p>
`);

export const ORDER_CONFIRMATION_TEMPLATE = getEmailShell("Item reserved!", `
  <h2 style="margin-top:0;">Your item was reserved!</h2>
  <p>A student (<strong>{{buyerName}}</strong>) just reserved your listing <strong>"{{listingTitle}}"</strong>.</p>
  <div style="background:#f1f5f9;padding:16px;border-radius:8px;margin:16px 0;">
    <strong>Order ID:</strong> {{orderNumber}}<br>
    <strong>Amount to collect:</strong> ₹{{amount}}
  </div>
  <p>Please check your ScholarNest exchanges dashboard to coordinate a public campus meetup for the handoff.</p>
`);
