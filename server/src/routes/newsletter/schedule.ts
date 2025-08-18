import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { GooglePubSubService } from "../../services/pubsub/gcp";
import { getOrCreateNewsletter } from "../../scheduler/newsletter-scheduler";

// for testing and manual triggering
export const scheduleNewsletterHandler =
  (prisma: PrismaClient, pubSub: GooglePubSubService) =>
  async (request: Request, response: Response) => {
    try {
      const { email, topic } = request.body;

      if (!email || !topic) {
        return response.status(400).json({
          message: "Email and topic are required",
        });
      }

      const date = new Date().toISOString().slice(0, 10);

      try {
        // get or create newsletter content
        const content = await getOrCreateNewsletter(topic, date);
        console.log(`    got content (${content.length} chars)`);

        // publish to pub/sub for processing
        await pubSub.publish("newsletter-daily", { email, topic, content });
        console.log("Newsletter scheduled and published");

        // update subscriber's last topic
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            lastTopic:
              (
                await prisma.newsletterSubscriber.findUnique({
                  where: { email },
                })
              )?.lastTopic || 0 + 1,
          },
        });

        return response.status(200).json({
          message: "Newsletter scheduled successfully",
          content: content.substring(0, 100) + "...",
        });
      } catch (error) {
        console.error("Error in newsletter generation:", error);
        return response.status(500).json({
          message: "Failed to generate newsletter",
        });
      }
    } catch (error) {
      console.error("Error in schedule handler:", error);
      return response.status(500).json({
        message: "Internal server error",
      });
    }
  };

// for daily automated newsletters (called by Cloud Scheduler)
export const dailyNewsletterHandler =
  (prisma: PrismaClient, pubSub: GooglePubSubService) =>
  async (request: Request, response: Response) => {
    try {
      console.log("Daily newsletter job triggered by Cloud Scheduler");

      // get all confirmed and active subscribers
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { confirmed: true, active: true },
        select: { email: true, topics: true, lastTopic: true },
      });

      if (subscribers.length === 0) {
        console.log("No active subscribers found");
        return response.status(200).json({
          message: "No active subscribers found",
          processed: 0,
        });
      }

      console.log(`Found ${subscribers.length} active subscribers`);

      const date = new Date().toISOString().slice(0, 10);
      let processedCount = 0;

      // process each subscriber
      for (const subscriber of subscribers) {
        const { email, topics, lastTopic } = subscriber;

        if (topics.length === 0) {
          console.log(`Subscriber ${email} has no topics, skipping`);
          continue;
        }

        try {
          // pick next topic (cycle through their topics)
          const topicIndex = lastTopic % topics.length;
          const topic = topics[topicIndex];

          console.log(`Processing ${email}: topic #${topicIndex} "${topic}"`);

          // get or create content
          const content = await getOrCreateNewsletter(topic, date);
          console.log(`    got content (${content.length} chars)`);

          // publish to pub/sub for async processing
          await pubSub.publish("newsletter-daily", { email, topic, content });
          console.log(`    published to pub/sub for ${email}`);

          // update subscriber's last topic
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: { lastTopic: lastTopic + 1 },
          });
          console.log(`    updated lastTopic for ${email} to ${lastTopic + 1}`);

          processedCount++;
        } catch (error) {
          console.error(`Error processing subscriber ${email}:`, error);
          // continue with other subscribers
        }
      }

      console.log(
        `Daily newsletter job completed. Processed ${processedCount} subscribers`
      );

      return response.status(200).json({
        message: "Daily newsletter job completed successfully",
        processed: processedCount,
        total: subscribers.length,
      });
    } catch (error) {
      console.error("Error in daily newsletter job:", error);
      return response.status(500).json({
        message: "Internal server error during daily newsletter job",
      });
    }
  };
