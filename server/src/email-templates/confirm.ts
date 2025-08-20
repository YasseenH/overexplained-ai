export function renderConfirmationEmail(link: string) {
  let brandName = "Overexplained";
  return {
    subject: `Confirm your subscription to Overexplained`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #f4f6f8, #e8ecf0); padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">

          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #667eea; font-size: 36px; font-weight: 700; margin-bottom: 10px; letter-spacing: -1px;">
              ${brandName}
            </h1>
            <p style="color: #64748b; font-size: 18px; margin: 0; font-weight: 300;">
              Your daily dose of fascinating knowledge
            </p>
          </div>

          <h2 style="color: #1e293b; font-size: 28px; margin-bottom: 16px; text-align: center;">
            Confirm your email
          </h2>
          <p style="font-size: 16px; color: #334155; margin-bottom: 24px; line-height: 1.65; text-align: center;">
            Please confirm your subscription so we can start sending you simple, engaging explanations every morning.
          </p>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${link}" style="
              display: inline-block;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: #ffffff;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 28px;
              font-weight: 600;
              font-size: 16px;
              letter-spacing: 0.2px;
            ">
              Confirm email
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px; line-height: 1.6; text-align: center;">
            If the button does not work, copy and paste this link into your browser:
            <br/>
            <a href="${link}" style="color: #667eea; text-decoration: none;">${link}</a>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            Delivered by Overexplained
          </p>
        </div>
      </div>
    `,
  };
}
