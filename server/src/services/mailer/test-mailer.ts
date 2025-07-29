import { MailerService, SendConfirmationEmailPayload, SendNewsletterEmailPayload, SendWelcomeEmailPayload } from "./types";

export default class TestMailer implements MailerService {
  async sendConfirmationEmail(payload: SendConfirmationEmailPayload): Promise<void> {
    console.log("TEST Sending confirmation email with payload:", payload);
    return Promise.resolve();
  }

  async sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void> {
    console.log("TEST Sending welcome email to:", payload.email);
    return Promise.resolve();
  }

    async sendNewsletterEmail(payload: SendNewsletterEmailPayload): Promise<void> {
    console.log("TEST Sending newsletter email with payload:", payload);
    return Promise.resolve();
  }
}
