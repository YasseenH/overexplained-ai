import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

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
