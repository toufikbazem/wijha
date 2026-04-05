export const verifyEmailHtml = (url) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #f0f4f8;
      font-family: 'DM Sans', sans-serif;
      padding: 48px 16px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .email-wrapper {
      max-width: 560px;
      width: 100%;
      margin: 0 auto;
    }

    /* Header bar */
    .email-header {
      background: #008CBA;
      border-radius: 16px 16px 0 0;
      padding: 32px 48px 28px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.18);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-mark svg { display: block; }

    .brand-name {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      color: #ffffff;
      letter-spacing: 0.3px;
    }

    /* Body card */
    .email-body {
      background: #ffffff;
      padding: 52px 48px 44px;
    }

    /* Icon circle */
    .icon-wrap {
      width: 72px;
      height: 72px;
      background: #e6f5fb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
    }

    h1 {
      font-family: 'DM Serif Display', serif;
      font-size: 28px;
      color: #0d1b2a;
      margin-bottom: 14px;
      line-height: 1.25;
    }

    .subtitle {
      font-size: 15px;
      color: #5a6a7a;
      line-height: 1.7;
      margin-bottom: 36px;
      max-width: 420px;
    }

    /* Button */
    .btn-verify {
      display: inline-block;
      background: #008CBA;
      color: #ffffff;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.3px;
      padding: 15px 40px;
      border-radius: 10px;
      margin-bottom: 36px;
      transition: background 0.2s ease, transform 0.15s ease;
    }

    .btn-verify:hover {
      background: #006f96;
      transform: translateY(-1px);
    }

    /* Divider */
    .divider {
      height: 1px;
      background: #e8edf2;
      margin-bottom: 28px;
    }

    /* Fallback link block */
    .fallback {
      background: #f6f9fb;
      border: 1px solid #dde8ef;
      border-radius: 10px;
      padding: 18px 20px;
      margin-bottom: 32px;
    }

    .fallback-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #8a9aaa;
      margin-bottom: 8px;
    }

    .fallback-link {
      font-size: 13px;
      color: #008CBA;
      word-break: break-all;
      text-decoration: none;
      font-weight: 500;
    }

    /* Expiry notice */
    .expiry {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #8a9aaa;
      margin-bottom: 0;
    }

    .expiry svg { flex-shrink: 0; }

    /* Footer */
    .email-footer {
      background: #f6f9fb;
      border-radius: 0 0 16px 16px;
      border-top: 1px solid #e8edf2;
      padding: 24px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .footer-note {
      font-size: 12.5px;
      color: #8a9aaa;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      gap: 16px;
    }

    .footer-links a {
      font-size: 12.5px;
      color: #008CBA;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
<div class="email-wrapper">

  <!-- Header -->
  <div class="email-header">
    <div class="logo-mark">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L16 5V13L9 17L2 13V5L9 1Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
        <circle cx="9" cy="9" r="2.5" fill="white"/>
      </svg>
    </div>
    <span class="brand-name">Yourapp</span>
  </div>

  <!-- Body -->
  <div class="email-body">

    <div class="icon-wrap">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="8" width="24" height="17" rx="3" stroke="#008CBA" stroke-width="1.8"/>
        <path d="M4 11L16 19L28 11" stroke="#008CBA" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </div>

    <h1>Verify your email address</h1>

    <p class="subtitle">
      Thanks for signing up! Please confirm your email address so we can activate your account and keep you secure.
    </p>

    <a href="#" class="btn-verify">Verify Email Address</a>

    <div class="divider"></div>

    <div class="fallback">
      <div class="fallback-label">Or copy this link</div>
      <a href="#" class="fallback-link">https://yourapp.com/verify?token=abc123xyz456def789</a>
    </div>

    <p class="expiry">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7.5" cy="7.5" r="6" stroke="#8a9aaa" stroke-width="1.4"/>
        <path d="M7.5 4.5V7.5L9.5 9" stroke="#8a9aaa" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      This link expires in <strong style="color:#0d1b2a; margin-left:3px;">24 hours</strong>.
    </p>

  </div>

  <!-- Footer -->
  <div class="email-footer">
    <p class="footer-note">
      If you didn't create an account, you can safely ignore this email.
    </p>
    <div class="footer-links">
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Unsubscribe</a>
    </div>
  </div>

</div>
</body>
</html>
  `;
};
