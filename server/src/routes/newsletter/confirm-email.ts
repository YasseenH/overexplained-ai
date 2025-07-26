import { PrismaClient } from "@prisma/client";
import { ErrorCode } from "../../errors/api-error";
import { PubSubService } from "../../services/pubsub/types";
import { Request, Response } from "express";
import { isEmailValid } from "../../utils/email";
import { confirmSubscriber } from "../../services/newsletter";

interface ConfirmEmailPayload {
  email?: string;
  token?: string;
}

export const confirmEmailHandler =
  (prisma: PrismaClient, pubSub: PubSubService) =>
  async (request: Request, response: Response) => {
    try {
      const { email = "", token = "" } = request.body as ConfirmEmailPayload;

      if (!email) {
        return response.status(400).json(new ErrorCode("ERR-003", "email"));
      }

      if (!isEmailValid(email)) {
        return response.status(400).json(new ErrorCode("ERR-002", "email"));
      }
      if (!token) {
        return response.status(400).json(new ErrorCode("ERR-002", "token"));
      }

      await confirmSubscriber(prisma, email, token);

      await pubSub.publish("newsletter-email-confirmed", {
        email,
      });
      return response
        .status(200)
        .json({
          message: "Email confirmed successfully",
        })
        .send();
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("Error in newsletter confirm-email handler:", error);
        throw new Error(String(error));
      }

      if (error.code === "ERR-001") {
        return response.status(404).json({
          message: error.message,
        });
      }

      if (["ERR-002", "ERR-003"].includes(error.code)) {
        return response.status(400).json({
          message: error.message,
        });
      }

      return response.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
