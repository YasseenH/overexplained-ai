import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";
import { GooglePubSubService } from "../services/pubsub/gcp";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pubSub = new GooglePubSubService(process.env.GCP_PROJECT_ID!);

/**
 * Fetches yesterday/today's newsletter for a topic from the DB,
 * or generates it if missing, then stores it.
 */
export async function getOrCreateNewsletter(
  topic: string,
  date: string
): Promise<string> {
  // 1) Try to read existing
  const existing = await prisma.dailyNewsletter.findUnique({
    where: {
      topic_date: { topic, date },
    },
  });
  if (existing) {
    return existing.content;
  }

  // 2) Generate with OpenAI
  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Write a concise daily newsletter about ${topic}.`,
      },
    ],
  });
  const content = resp.choices[0].message.content!;

  await prisma.dailyNewsletter.create({
    data: { topic, date, content },
  });

  return content;
}

async function runDaily() {
  const date = new Date().toISOString().slice(0, 10);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { confirmed: true },
    select: { email: true, topics: true, lastTopic: true },
  });

  console.log(`[Scheduler] Found ${subscribers.length} confirmed subscribers`);

  // round-robin through subscriber's topics
  for (const sub of subscribers) {
    const { email, topics, lastTopic } = sub;
    if (topics.length === 0) {
      console.log(`[Scheduler] Subscriber ${email} has no topics, skipping`);
      continue;
    }

    const nextIdx = lastTopic % topics.length;
    const topic = topics[nextIdx];

    console.log(`${email}: sending topic #${nextIdx} "${topic}"`);

    // get/create content
    //const content = await getOrCreateNewsletter(topic, date); // TODO: Uncomment to use OpenAI generation
    const content = `This is a placeholder content for topic "${topic}" on date ${date}.`;
    console.log(`    got content (${content.length} chars)`);

    await pubSub.publish("newsletter-daily", { email, topic, content });
    console.log(`    published Pub/Sub message`);

    // update subscriber so next time we cycle
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { lastTopic: nextIdx + 1 },
    });
    console.log(`    updated lastTopic for ${email} to ${nextIdx + 1}`);
  }
  console.log("[Scheduler] Run complete");
}

runDaily().catch((err) => {
  console.error("Scheduler error:", err);
  process.exit(1);
});
