import { PrismaClient } from "@prisma/client";
import { createServer } from "./server";
import { GooglePubSubService } from "./services/pubsub/gcp";
import { ResendService } from "./services/mailer/resend";

const PORT = process.env.PORT || 8080;

const prisma = new PrismaClient();
const pubSub = new GooglePubSubService(process.env.GCP_PROJECT_ID || "");
const mailer = new ResendService({
  apiKey: process.env.RESEND_API_KEY || "",
  sender: process.env.RESEND_SENDER || "",
});

const server = createServer({ prisma, pubSub, mailer }).listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
