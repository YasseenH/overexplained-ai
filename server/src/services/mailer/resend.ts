import { Resend } from "resend";
import {
  MailerService,
  SendConfirmationEmailPayload,
  SendNewsletterEmailPayload,
  SendWelcomeEmailPayload,
} from "./types";
import { APP_URL } from "../../utils/constants";
import { renderWelcomeEmail } from "../../email-templates/welcome";
import { renderConfirmationEmail } from "../../email-templates/confirm";

interface ResendServiceConfig {
  sender: string;
  apiKey: string;
}

export class ResendService implements MailerService {
  private readonly sender: string;
  private readonly resend: Resend;

  constructor({ sender, apiKey }: ResendServiceConfig) {
    this.resend = new Resend(apiKey);
    this.sender = sender;
  }

  async sendWelcomeEmail({ email }: SendWelcomeEmailPayload): Promise<void> {
    const { subject, html } = renderWelcomeEmail();
    if (!email) throw new Error("Missing email address");

    console.log("Sending welcome email to:", email);
    await this.resend.emails.send({
      from: this.sender,
      to: email,
      subject,
      html,
    });
  }

  async sendConfirmationEmail({
    email,
    token,
  }: SendConfirmationEmailPayload): Promise<void> {
    const link = `${APP_URL}/confirm-email?token=${token}&email=${email}`;
    const { subject, html } = renderConfirmationEmail(link);

    if (!email) throw new Error("Missing email address");

    console.log("Sending confirmation email to:", email);
    await this.resend.emails.send({
      from: this.sender,
      to: email,
      subject,
      html,
    });
  }

  async sendNewsletterEmail({
    email,
    topic,
    content,
  }: SendNewsletterEmailPayload): Promise<void> {
    const subject = `Your Daily Newsletter on ${topic}`;
    const html = `
      <div>
        <h1>${topic}</h1>
        <div>${content}</div>
        <hr/>
        <p>If you’d rather not receive these, click <a href="${APP_URL}/unsubscribe?email=${email}">here</a>.</p>
      </div>
    `;
    await this.resend.emails.send({
      from: this.sender,
      to: email,
      subject,
      html,
    });
  }
}
