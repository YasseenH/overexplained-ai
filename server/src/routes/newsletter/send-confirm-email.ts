import { Request, Response } from "express";
import { isPubSubPayload } from "../../services/pubsub/gcp";
import { ErrorCode } from "../../errors/api-error";

export const sendConfirmEmailHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { body } = request;

    if (!isPubSubPayload(body)) {
      throw new Error("ERR-003");
    }

    const {
      message: { data: encodedJsonObject },
    } = body;

    const parseBuffer = Buffer.from(
      encodedJsonObject as string,
      "base64"
    ).toString("ascii");

    const parsedPayload = JSON.parse(parseBuffer);

    //send email
    console.log("sendConfirmHandler", parsedPayload);

    return response.status(200).json({
      message: "OK",
    });
  } catch (error: unknown) {
    if (!(error instanceof ErrorCode)) {
      console.error("Error in newsletter confirm-email handler:", error);
      throw new Error(String(error));
    }

    if (["ERR-003"].includes(error.code)) {
      return response.status(400).json(error.message);
    }

    throw new Error(String(error));
  }
};
