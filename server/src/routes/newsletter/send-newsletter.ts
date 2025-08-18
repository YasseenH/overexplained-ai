import { Request, Response } from "express";
import { isPubSubPayload } from "../../services/pubsub/gcp";
import { MailerService } from "../../services/mailer/types";
import { ErrorCode } from "../../errors/api-error";

export const sendNewsletterHandler =
  (mailer: MailerService) => async (req: Request, res: Response) => {
    try {
      const body = req.body;
      // validation
      if (!isPubSubPayload(body)) {
        throw new ErrorCode("ERR-003");
      }

      // decode the message
      const encoded = body.message.data as string;
      const json = Buffer.from(encoded, "base64").toString("utf-8");
      const { email, topic, content } = JSON.parse(json) as {
        email: string;
        topic: string;
        content: string;
      };

      // send the newsletter email
      await mailer.sendNewsletterEmail({ email, topic, content });

      // success
      return res.status(200).json({ message: "OK" });
    } catch (err: unknown) {
      if (err instanceof ErrorCode && err.code === "ERR-003") {
        return res.status(400).json({ message: err.message });
      }
      console.error("Error in send-newsletter handler:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
