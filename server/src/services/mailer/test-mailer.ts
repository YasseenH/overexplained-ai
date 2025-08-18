import {
  MailerService,
  SendConfirmationEmailPayload,
  SendNewsletterEmailPayload,
  SendWelcomeEmailPayload,
} from "./types";
import { renderNewsletterEmail } from "../../email-templates/newsletter";

export default class TestMailer implements MailerService {
  async sendConfirmationEmail(
    payload: SendConfirmationEmailPayload
  ): Promise<void> {
    console.log("TEST Sending confirmation email with payload:", payload);
    return Promise.resolve();
  }

  async sendWelcomeEmail(payload: SendWelcomeEmailPayload): Promise<void> {
    console.log("TEST Sending welcome email to:", payload.email);
    return Promise.resolve();
  }

  async sendNewsletterEmail(
    payload: SendNewsletterEmailPayload
  ): Promise<void> {
    const { subject, html } = renderNewsletterEmail(
      payload.topic,
      payload.content,
      "#"
    );
    console.log("TEST Sending newsletter email with payload:", payload);
    console.log("TEST Newsletter subject:", subject);
    console.log("TEST Newsletter HTML length:", html.length);
    return Promise.resolve();
  }
}
