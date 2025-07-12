import express from "express";
import { newsletterSignupHandler } from "./signup";
import { PrismaClient } from "@prisma/client";
import { PubSubService } from "../../services/pubsub/types";
import { sendConfirmEmailHandler } from "./send-confirm-email";

export const createNewsletterRouter = (prisma: PrismaClient, pubSub: PubSubService) => {
  const newsletterRouter = express.Router();

  newsletterRouter.post("/newsletter/signup", newsletterSignupHandler(prisma, pubSub));

  newsletterRouter.post("/confirm-email-sent", sendConfirmEmailHandler);
  return newsletterRouter;
};
