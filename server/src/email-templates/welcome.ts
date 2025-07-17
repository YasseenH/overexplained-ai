export function renderWelcomeEmail() {
  return {
    subject: `Welcome to Our Newsletter!`,
    html: `
      <div style="font-family: sans-serif;">
        <h1>👋 Welcome!</h1>
        <p>Thanks for subscribing. We're excited to have you on board.</p>
      </div>
    `,
  };
}
