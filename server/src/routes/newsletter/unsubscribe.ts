import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorCode } from "../../errors/api-error";
import { isEmailValid } from "../../utils/email";

export const unsubscribeHandler =
  (prisma: PrismaClient) => async (request: Request, response: Response) => {
    try {
      const { email } = request.body;

      if (!email) {
        return response.status(400).json(new ErrorCode("ERR-001", "email"));
      }

      if (!isEmailValid(email)) {
        return response.status(400).json(new ErrorCode("ERR-002", "email"));
      }

      // find and update the subscriber to mark them as inactive
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (!subscriber) {
        return response.status(404).json({
          message: "Subscriber not found",
        });
      }

      // mark as inactive
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: false },
      });

      console.log(`User ${email} unsubscribed from newsletter`);

      return response.status(200).json({
        message: "Successfully unsubscribed from newsletter",
      });
    } catch (error: unknown) {
      console.error("Error in unsubscribe handler:", error);
      return response.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
