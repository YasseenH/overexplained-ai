export function renderWelcomeEmail() {
  let brandName = "Magic Conch";
  return {
    subject: `Welcome to the Newsletter!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #f4f6f8, #e8ecf0); padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

          <h2 style="color: #1a73e8; font-size: 20px; margin-bottom: 30px;">${brandName}</h2>

          <h1 style="color: #1a1a1a; margin-bottom: 20px;">Welcome Aboard!</h1>
          <p style="font-size: 16px; color: #444444; margin-bottom: 20px;">
            Thanks for subscribing! We’re excited to have you in our community.
          </p>
          <p style="font-size: 16px; color: #444444; margin-bottom: 30px;">
            Expect regular insights, curated content, and helpful tips straight to your inbox.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />

          <p style="font-size: 14px; color: #999999;">
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
      </div>
    `,
  };
}
