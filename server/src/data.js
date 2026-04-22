export const verifyEmailHtml = (url) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email — Wijha</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 48px 16px;
    }

    .email-wrapper {
      max-width: 580px;
      width: 100%;
      margin: 0 auto;
    }

    /* ── Header ── */
    .email-header {
      background: linear-gradient(135deg, #008CBA 0%, #006f96 100%);
      border-radius: 16px 16px 0 0;
      padding: 28px 40px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }

    /* ── Body ── */
    .email-body {
      background: #ffffff;
      padding: 48px 40px 40px;
      border-left: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      background: #e0f4fb;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .email-title {
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      letter-spacing: -0.4px;
      line-height: 1.3;
    }

    .email-subtitle {
      font-size: 15px;
      color: #64748b;
      line-height: 1.75;
      margin-bottom: 32px;
      max-width: 440px;
    }

    /* ── Primary Button ── */
    .btn-primary {
      display: inline-block;
      background: #008CBA;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.1px;
      padding: 14px 36px;
      border-radius: 10px;
      margin-bottom: 36px;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: #f1f5f9;
      margin-bottom: 28px;
    }

    /* ── Fallback link box ── */
    .fallback {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }

    .fallback-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .fallback-link {
      font-size: 13px;
      color: #008CBA;
      word-break: break-all;
      text-decoration: none;
      font-weight: 500;
    }

    /* ── Expiry notice ── */
    .expiry {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 9px 14px;
      font-size: 13px;
      color: #92400e;
    }

    .expiry strong {
      font-weight: 600;
      color: #78350f;
    }

    /* ── Footer ── */
    .email-footer {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 16px 16px;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .footer-note {
      font-size: 12.5px;
      color: #94a3b8;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 18px;
    }

    .footer-links a {
      font-size: 12.5px;
      color: #008CBA;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
<div class="email-wrapper">

  <!-- Header -->
  <div class="email-header">
    <div class="logo-mark">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="10" cy="10" r="2.8" fill="white"/>
      </svg>
    </div>
    <span class="brand-name">Wijha</span>
  </div>

  <!-- Body -->
  <div class="email-body">

    <div class="icon-wrap">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="24" height="17" rx="3.5" stroke="#008CBA" stroke-width="1.8"/>
        <path d="M3 11L15 19L27 11" stroke="#008CBA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <h1 class="email-title">Verify your email address</h1>

    <p class="email-subtitle">
      Thanks for signing up for Wijha! Please confirm your email address to activate your account and get started.
    </p>

    <a href="${url}" class="btn-primary">Verify Email Address</a>

    <div class="divider"></div>

    <div class="fallback">
      <div class="fallback-label">Or copy &amp; paste this link</div>
      <a href="${url}" class="fallback-link">${url}</a>
    </div>

    <div class="expiry">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="5.5" stroke="#d97706" stroke-width="1.3"/>
        <path d="M7 4V7L9 8.5" stroke="#d97706" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      This link expires in <strong>24 hours</strong>
    </div>

  </div>

  <!-- Footer -->
  <div class="email-footer">
    <p class="footer-note">
      Didn't create an account? You can safely ignore this email.
    </p>
    <div class="footer-links">
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Unsubscribe</a>
    </div>
  </div>

</div>
</body>
</html>`;
};

export const resetPasswordEmailHtml = (url) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password — Wijha</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 48px 16px;
    }

    .email-wrapper {
      max-width: 580px;
      width: 100%;
      margin: 0 auto;
    }

    /* ── Header ── */
    .email-header {
      background: linear-gradient(135deg, #008CBA 0%, #006f96 100%);
      border-radius: 16px 16px 0 0;
      padding: 28px 40px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }

    /* ── Body ── */
    .email-body {
      background: #ffffff;
      padding: 48px 40px 40px;
      border-left: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      background: #fef3c7;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .email-title {
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      letter-spacing: -0.4px;
      line-height: 1.3;
    }

    .email-subtitle {
      font-size: 15px;
      color: #64748b;
      line-height: 1.75;
      margin-bottom: 32px;
      max-width: 440px;
    }

    /* ── Security warning banner ── */
    .security-banner {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-left: 3px solid #f97316;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 28px;
      font-size: 13px;
      color: #9a3412;
      line-height: 1.6;
    }

    .security-banner strong {
      font-weight: 600;
    }

    /* ── Primary Button ── */
    .btn-primary {
      display: inline-block;
      background: #008CBA;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.1px;
      padding: 14px 36px;
      border-radius: 10px;
      margin-bottom: 36px;
    }

    /* ── Divider ── */
    .divider {
      height: 1px;
      background: #f1f5f9;
      margin-bottom: 28px;
    }

    /* ── Fallback link box ── */
    .fallback {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }

    .fallback-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .fallback-link {
      font-size: 13px;
      color: #008CBA;
      word-break: break-all;
      text-decoration: none;
      font-weight: 500;
    }

    /* ── Expiry notice ── */
    .expiry {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 9px 14px;
      font-size: 13px;
      color: #92400e;
    }

    .expiry strong {
      font-weight: 600;
      color: #78350f;
    }

    /* ── Footer ── */
    .email-footer {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 16px 16px;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .footer-note {
      font-size: 12.5px;
      color: #94a3b8;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 18px;
    }

    .footer-links a {
      font-size: 12.5px;
      color: #008CBA;
      text-decoration: none;
      font-weight: 500;
    }
  </style>
</head>
<body>
<div class="email-wrapper">

  <!-- Header -->
  <div class="email-header">
    <div class="logo-mark">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="10" cy="10" r="2.8" fill="white"/>
      </svg>
    </div>
    <span class="brand-name">Wijha</span>
  </div>

  <!-- Body -->
  <div class="email-body">

    <div class="icon-wrap">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="12" width="10" height="11" rx="1.5" stroke="#d97706" stroke-width="1.8"/>
        <path d="M12 12V9.5a3 3 0 1 1 6 0V12" stroke="#d97706" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="15" cy="17.5" r="1.2" fill="#d97706"/>
      </svg>
    </div>

    <h1 class="email-title">Reset your password</h1>

    <p class="email-subtitle">
      We received a request to reset the password for your Wijha account. Click the button below to create a new password.
    </p>

    <div class="security-banner">
      <strong>Didn't request this?</strong> If you didn't ask to reset your password, you can ignore this email — your account remains secure.
    </div>

    <a href="${url}" class="btn-primary">Reset Password</a>

    <div class="divider"></div>

    <div class="fallback">
      <div class="fallback-label">Or copy &amp; paste this link</div>
      <a href="${url}" class="fallback-link">${url}</a>
    </div>

    <div class="expiry">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="5.5" stroke="#d97706" stroke-width="1.3"/>
        <path d="M7 4V7L9 8.5" stroke="#d97706" stroke-width="1.3" stroke-linecap="round"/>
      </svg>
      This link expires in <strong>15 minutes</strong>
    </div>

  </div>

  <!-- Footer -->
  <div class="email-footer">
    <p class="footer-note">
      Didn't request a password reset? You can safely ignore this email.
    </p>
    <div class="footer-links">
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Unsubscribe</a>
    </div>
  </div>

</div>
</body>
</html>`;
};
