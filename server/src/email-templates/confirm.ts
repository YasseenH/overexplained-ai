export function renderConfirmationEmail(link: string) {
  let brandName = "Magic Conch";
  return {
    subject: `Confirm Your Subscription`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #f4f6f8, #e8ecf0); padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <h2 style="color: #1a73e8; font-size: 20px; margin-bottom: 30px;">${brandName}</h2>
          
          <h1 style="color: #222222; margin-bottom: 20px;">Almost there!</h1>
          <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">
            Please confirm your subscription by clicking the button below:
          </p>
          
          <a href="${link}" style="
            display: inline-block;
            background-color: #1a73e8;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.3s ease;
          ">
            Confirm Email
          </a>

          <p style="font-size: 14px; color: #999999; margin-top: 40px;">
            If you didn’t sign up for this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };
}
