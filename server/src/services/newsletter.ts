import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { ErrorCode } from "../errors/api-error";
import { TopicKey } from "../utils/topics";

export const upsertSubscriber = async (
  prisma: PrismaClient,
  email: string,
  topics: TopicKey[]
) => {
  try {
    const newsletterSubscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        active: false,
        confirmed: false,
        token: createRandomToken(),
        topics,
      },
      update: {
        active: false,
        confirmed: false,
        token: createRandomToken(),
        topics,
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

  const updatedSubscriber = await prisma.newsletterSubscriber.update({
    where: { email },
    data: { confirmed: true, active: true, token: "" },
  });

  return updatedSubscriber;
};
