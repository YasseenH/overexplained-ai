import { Request, Response } from "express";
import { isEmailValid } from "../../utils/email";
import { PrismaClient } from "@prisma/client";
import { upsertSubscriber } from "../../services/newsletter";
import { ErrorCode } from "../../errors/api-error";

interface SignupBody {
  email?: string;
}

export const newsletterSignupHandler =
  (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
      const { email = "" } = req.body as SignupBody;

      if (!email) {
        throw new ErrorCode("ERR-001", "email");
      }
      if (!isEmailValid(email)) {
        throw new ErrorCode("ERR-002", "email");
      }

      // Sign up the user by upserting the subscriber in the database
      const newsletterSubscriber = await upsertSubscriber(prisma, email);

      console.log("Newsletter subscriber upserted");

      //Publish

      return res.status(201).json(newsletterSubscriber);
    } catch (error: unknown) {
      if (!(error instanceof ErrorCode)) {
        console.error("Error in newsletter signup handler:", error);
        throw new Error(String(error));
      }

      if (["ERR-001", "ERR-002"].includes(error.code)) {
        return res.status(400).json({
          message: error.message,
        });
      }
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
