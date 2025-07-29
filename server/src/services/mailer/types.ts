export interface SendConfirmationEmailPayload {
  email: string;
  token: string;
}

export interface SendWelcomeEmailPayload {
  email: string;
}

export interface SendNewsletterEmailPayload {
  email: string;
  topic: string;
  content: string;
}

export interface MailerService {
  sendConfirmationEmail: (
    payload: SendConfirmationEmailPayload
  ) => Promise<void>;
  sendWelcomeEmail: (payload: SendWelcomeEmailPayload) => Promise<void>;
  sendNewsletterEmail: (payload: SendNewsletterEmailPayload) => Promise<void>;
}
