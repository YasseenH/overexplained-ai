import express from "express";
import { newsletterSignupHandler } from "./signup";
import { PrismaClient } from "@prisma/client";
import { PubSubService } from "../../services/pubsub/types";
import { sendConfirmEmailHandler } from "./send-confirm-email";
import { MailerService } from "../../services/mailer/types";
import { confirmEmailHandler } from "./confirm-email";
import { sendWelcomeEmailHandler } from "./send-welcome-email";
import { sendNewsletterHandler } from "./send-newsletter";
import { unsubscribeHandler } from "./unsubscribe";
import { scheduleNewsletterHandler, dailyNewsletterHandler } from "./schedule";

export const createNewsletterRouter = (
  prisma: PrismaClient,
  pubSub: PubSubService,
  mailer: MailerService
) => {
  const newsletterRouter = express.Router();

  newsletterRouter.post(
    "/newsletter/signup",
    newsletterSignupHandler(prisma, pubSub)
  );

  newsletterRouter.post("/confirm-email-sent", sendConfirmEmailHandler(mailer));

  newsletterRouter.post(
    "/newsletter/confirm-email",
    confirmEmailHandler(prisma, pubSub)
  );

  newsletterRouter.post(
    "/newsletter/send-welcome-email",
    sendWelcomeEmailHandler(mailer)
  );

  // simple test endpoint for welcome emails
  newsletterRouter.post("/newsletter/test-welcome", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await mailer.sendWelcomeEmail({ email });
      res.json({ message: "Welcome email sent successfully" });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ message: "Failed to send welcome email" });
    }
  });

  newsletterRouter.post(
    "/newsletter/send-newsletter",
    sendNewsletterHandler(mailer)
  );

  newsletterRouter.post("/newsletter/unsubscribe", unsubscribeHandler(prisma));

  // cloud scheduler endpoint for daily newsletters
  newsletterRouter.post(
    "/newsletter/schedule",
    scheduleNewsletterHandler(prisma, pubSub as any)
  );

  // automated daily newsletter endpoint (called by Cloud Scheduler)
  newsletterRouter.post(
    "/newsletter/daily",
    dailyNewsletterHandler(prisma, pubSub as any)
  );

  return newsletterRouter;
};
