import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import { GooglePubSubService } from "../services/pubsub/gcp";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const pubSub = new GooglePubSubService(process.env.GCP_PROJECT_ID || "");

// get or create newsletter content for a topic and date
export async function getOrCreateNewsletter(
  topic: string,
  date: string
): Promise<string> {
  // first try to read existing content
  const existing = await prisma.dailyNewsletter.findUnique({
    where: {
      topic_date: { topic, date },
    },
  });

  if (existing) {
    return existing.content;
  }

  // generate new content with OpenAI
  const prompt = `You are a HowStuffWorks expert writer creating engaging, educational content that makes complex topics accessible to curious minds.

Write a daily newsletter about: ${topic}

Create a newsletter article that follows this exact structure:

**HEADLINE**: Write a compelling, question-based headline like "What Is [Topic] and How Does It Work?" or "How Does [Topic] Actually Work?" Make it curiosity-driven and specific.

**QUICK SUMMARY** (2-3 sentences):
- Hook the reader with an interesting fact or question that makes them want to learn more
- Clearly state what they'll learn and why it matters

**MAIN EXPLANATION** (3-4 paragraphs):
- Start with the basics: "What is [topic]?" - give a clear, simple definition
- Explain how it works in simple terms - break down the process step-by-step
- Use analogies and real-world examples that make abstract concepts concrete
- Connect to everyday experiences people can relate to

**INTERESTING FACTS** (2-3 bullet points):
- "Did you know..." facts that surprise and delight
- Historical context or fun trivia that adds depth
- Surprising applications or examples that show the topic's reach

**REAL-WORLD APPLICATIONS** (1-2 paragraphs):
- Where do we see this in everyday life?
- Practical examples and use cases that make the topic relevant
- How does this affect our daily lives or the world around us?

**KEY TAKEAWAY** (1 sentence):
- One clear, memorable insight that summarizes the main learning
- Make it something readers can share or remember easily

Requirements:
- Length: 800-1200 words (5-8 minute read)
- Tone: Conversational, curious, and engaging - like explaining to a smart friend
- Language: Simple enough for a high school student to understand
- Examples: Use concrete, relatable analogies and real-world scenarios
- Structure: Clear headings, short paragraphs (2-3 sentences max), scannable format

Style Guidelines:
- Start paragraphs with engaging questions or "Imagine if..." scenarios
- Use "Think of it like..." for analogies that make complex ideas simple
- Include "Here's the fascinating part..." for interesting facts
- End with "The bottom line is..." for key takeaways
- Make readers feel smarter and more curious about the world

Remember: This should feel like a daily dose of fascinating knowledge that readers look forward to with their morning coffee. Make complex topics feel accessible and exciting!`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
  });

  const content =
    completion.choices[0]?.message?.content || "Unable to generate content";

  // save to database
  await prisma.dailyNewsletter.create({
    data: { topic, date, content },
  });

  return content;
}

// main scheduler function
async function runDaily() {
  const date = new Date().toISOString().slice(0, 10);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { confirmed: true, active: true },
    select: { email: true, topics: true, lastTopic: true },
  });

  console.log(`[Scheduler] Found ${subscribers.length} confirmed subscribers`);

  // round-robin through each subscriber's topics
  for (const sub of subscribers) {
    const { email, topics, lastTopic } = sub;

    if (topics.length === 0) {
      console.log(`[Scheduler] Subscriber ${email} has no topics, skipping`);
      continue;
    }

    const nextIdx = lastTopic % topics.length;
    const topic = topics[nextIdx];

    console.log(`${email}: sending topic #${nextIdx} "${topic}"`);

    // get or create content
    const content = await getOrCreateNewsletter(topic, date);
    console.log(`    got content (${content.length} chars)`);

    // publish to pub/sub for async processing
    await pubSub.publish("newsletter-daily", { email, topic, content });
    console.log("Newsletter content published to Pub/Sub");

    // update subscriber so next time we cycle through topics
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { lastTopic: nextIdx + 1 },
    });
    console.log(`    updated lastTopic for ${email} to ${nextIdx + 1}`);
  }

  console.log("[Scheduler] Run complete");
}

// export the function for manual execution (e.g., by Cloud Scheduler)
export { runDaily };
