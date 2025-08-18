import express from "express";
import { createNewsletterRouter } from "./routes/newsletter";
import { PrismaClient } from "@prisma/client";
import { GooglePubSubService } from "./services/pubsub/gcp";
import { ResendService } from "./services/mailer/resend";

const app = express();
const prisma = new PrismaClient();
const pubSub = new GooglePubSubService(process.env.GCP_PROJECT_ID || "");
const mailer = new ResendService({
  sender: process.env.RESEND_SENDER || "",
  apiKey: process.env.RESEND_API_KEY || "",
});

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/v1", createNewsletterRouter(prisma, pubSub, mailer));

// error handling
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export { app };
