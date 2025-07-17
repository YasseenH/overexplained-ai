export function renderConfirmationEmail(link: string) {
  return {
    subject: `Confirm your subscription`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>Almost there!</h2>
        <p>Click the button below to confirm your subscription:</p>
        <a href="${link}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none;">Confirm Email</a>
      </div>
    `,
  };
}
