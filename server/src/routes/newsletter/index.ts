import express from "express";
import { newsletterSignupHandler } from "./signup";
import { PrismaClient } from "@prisma/client";

export const createNewsletterRouter = (prisma: PrismaClient) => {
  const newsletterRouter = express.Router();

  newsletterRouter.post("/newsletter/signup", newsletterSignupHandler(prisma));

  return newsletterRouter;
};
