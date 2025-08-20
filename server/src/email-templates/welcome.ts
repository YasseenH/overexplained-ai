export function renderWelcomeEmail() {
  let brandName = "Overexplained";
  return {
    subject: `Welcome to Overexplained - Your Daily Dose of Fascinating Knowledge!`,
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

          <h2 style="color: #1e293b; font-size: 28px; margin-bottom: 20px; text-align: center;">
            Welcome to the Curious Minds Club!
          </h2>
          
          <p style="font-size: 18px; color: #334155; margin-bottom: 25px; line-height: 1.6;">
            You're about to embark on a daily journey of discovery! Every morning, you'll receive an engaging, educational newsletter that makes complex topics accessible and exciting.
          </p>

          <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #1e293b; font-size: 20px; margin: 0 0 15px 0;">
              What You'll Get Every Day:
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li style="margin: 0 0 8px 0;">Deep dives into fascinating topics</li>
              <li style="margin: 0 0 8px 0;">Science explained in simple terms</li>
              <li style="margin: 0 0 8px 0;">Mind-blowing facts you can share</li>
              <li style="margin: 0 0 8px 0;">Real-world connections to everyday life</li>
              <li style="margin: 0 0 8px 0;">Beautiful formatting that's easy to read</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #f59e0b;">
            <h3 style="color: #92400e; font-size: 20px; margin: 0 0 15px 0;">
              Topics You'll Explore:
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; color: #92400e;">
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">Science & Nature</span>
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">Technology</span>
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">History & Culture</span>
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">Health & Wellness</span>
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">Personal Finance</span>
              <span style="background: white; padding: 8px 12px; border-radius: 8px; font-size: 14px;">Arts & Creativity</span>
            </div>
          </div>

          <p style="font-size: 16px; color: #475569; margin-bottom: 25px; line-height: 1.6;">
            Your first newsletter will arrive tomorrow morning at 9:00 AM. Each edition is crafted to be a 5-8 minute read that fits perfectly with your morning routine.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #64748b; margin-bottom: 15px;">
              Ready to start learning something new every day?
            </p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
          
          <p style="font-size: 12px; color: #cbd5e1; text-align: center; margin: 20px 0 0 0;">
            Delivered by Overexplained
          </p>
        </div>
      </div>
    `,
  };
}
