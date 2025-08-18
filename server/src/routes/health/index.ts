import express from "express";
import httpStatus from "http-status";
import { PrismaClient } from "@prisma/client";

export const createHealthRouter = () => {
  const healthRouter = express.Router();

  healthRouter.get("/health", (_, res) => res.status(httpStatus.OK).send("ok"));

  // Add database test endpoint
  healthRouter.get("/health/db", async (_, res) => {
    try {
      // Test database connection by checking if we can access environment variables
      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        return res.status(500).json({ error: "DATABASE_URL not set" });
      }

      // Test if we can parse the MongoDB URL
      if (!dbUrl.includes("mongodb")) {
        return res.status(500).json({ error: "Invalid MongoDB URL format" });
      }

      return res.status(200).json({
        status: "ok",
        dbUrl: dbUrl.substring(0, 20) + "...", // Show first 20 chars for debugging
      });
    } catch (error) {
      console.error("Database health check error:", error);
      return res.status(500).json({ error: String(error) });
    }
  });

  // Add Prisma connection test endpoint
  healthRouter.get("/health/prisma", async (_, res) => {
    try {
      const prisma = new PrismaClient();

      // Test basic Prisma connection
      await prisma.$connect();
      console.log("Prisma connected successfully");

      // Simple connection test - just see if we can connect
      await prisma.$disconnect();

      return res.status(200).json({
        status: "ok",
        message: "Prisma connection successful",
      });
    } catch (error) {
      console.error("Prisma connection test error:", error);
      return res.status(500).json({
        error: String(error),
        message: "Prisma connection failed",
      });
    }
  });

  // Add database collection test endpoint
  healthRouter.get("/health/collection", async (_, res) => {
    try {
      const prisma = new PrismaClient();

      // Test basic Prisma connection
      await prisma.$connect();
      console.log("Prisma connected successfully");

      // Test if we can access the NewsletterSubscriber collection
      const count = await prisma.newsletterSubscriber.count();
      console.log("NewsletterSubscriber collection count:", count);

      await prisma.$disconnect();

      return res.status(200).json({
        status: "ok",
        message: "Collection access successful",
        count: count,
      });
    } catch (error) {
      console.error("Collection test error:", error);
      return res.status(500).json({
        error: String(error),
        message: "Collection access failed",
      });
    }
  });

  return healthRouter;
};
