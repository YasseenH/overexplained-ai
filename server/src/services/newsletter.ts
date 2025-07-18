import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { ErrorCode } from "../errors/api-error";

export const upsertSubscriber = async (prisma: PrismaClient, email: string) => {
  try {
    const newsletterSubscriber = await prisma.newsletterSubscriber.upsert({
      where: {
        email: email,
      },
      create: {
        email,
        active: false,
        confirmed: false,
        token: createRandomToken(),
      },
      update: {
        active: false,
        confirmed: false,
        token: createRandomToken(),
      },
    });

    return newsletterSubscriber;
  } catch (error) {
    console.error("Error upserting subscriber:", error);
    throw new Error("Failed to upsert subscriber");
  }
};

const createRandomToken = () => crypto.randomBytes(64).toString("hex");

export const confirmSubscriber = async (
  prisma: PrismaClient,
  email: string,
  token: string
) => {
  const subscriber = await prisma.newsletterSubscriber.findFirst({
    where: { email, token },
  });

  if (!subscriber) {
    throw new ErrorCode("ERR-001", "token");
  }

  const updatedSubscriber = prisma.newsletterSubscriber.update({
    where: { email },
    data: { confirmed: true, token: "" },
  });

  return updatedSubscriber;
};
