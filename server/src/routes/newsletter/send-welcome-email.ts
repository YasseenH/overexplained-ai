import { Request, Response } from "express";
import { isPubSubPayload } from "../../services/pubsub/gcp";
import { MailerService } from "../../services/mailer/types";
import { ErrorCode } from "../../errors/api-error";

export const sendWelcomeEmailHandler =
  (mailer: MailerService) => async (request: Request, response: Response) => {
    try {
      const { body } = request;
      if (!isPubSubPayload(body)) {
        throw new ErrorCode("ERR-003");
      }

      const {
        message: { data: encodedJsonObject },
      } = body;

      const parseBuffer = Buffer.from(
        encodedJsonObject as string,
        "base64"
      ).toString("ascii");

      const parsedPayload = JSON.parse(parseBuffer);

      await mailer.sendWelcomeEmail(parsedPayload);

      return response
        .status(200)
        .json({
          message: "Welcome email sent successfully",
        })
        .send();
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("Error in sendWelcomeEmailHandler:", error);
        throw new Error(String(error));
      }
      if (["ERR-003"].includes((error as ErrorCode).code)) {
        return response.status(400).json({
          message: (error as ErrorCode).message,
        });
      }
      throw new Error(String(error));
    }
  };
