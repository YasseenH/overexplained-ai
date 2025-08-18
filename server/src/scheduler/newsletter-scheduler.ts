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
  const prompt = `You are an expert newsletter writer who creates engaging, informative content that's perfect for daily reading. Your goal is to make complex topics accessible and enjoyable.

Write a daily newsletter about: ${topic}

Requirements:
- Length: 400-600 words (3-5 minute read)
- Tone: Conversational, friendly, and approachable - like explaining to a curious friend
- Structure: Use clear paragraph breaks and organize content logically

Content Structure:
1. Hook & Introduction (2-3 sentences)
   - Start with an engaging opening that captures attention
   - Clearly state what the reader will learn

2. Main Content (2-3 paragraphs)
   - Break down the topic into digestible sections
   - Use simple, clear language - avoid jargon
   - Include practical examples or real-world applications

3. Interesting Facts & Insights (1-2 paragraphs)
   - Share surprising or fascinating details
   - Use phrases like "Did you know..." or "Here's something fascinating..."
   - Connect to everyday life when possible

4. Key Takeaway (1 paragraph)
   - Summarize the main point in one clear sentence
   - End with an encouraging or thought-provoking note

Writing Guidelines:
- Use active voice and present tense
- Keep sentences under 25 words when possible
- Include specific examples and concrete details
- Make it feel like a conversation with a knowledgeable friend
- Ensure factual accuracy and reliability
- Add personality and warmth to make it enjoyable to read

Formatting:
- Use double line breaks between paragraphs for clean separation
- Number your main sections (1., 2., 3., etc.) for clear structure
- Make the content scannable and easy to follow

Remember: This should feel like a daily treat that readers look forward to with their morning coffee!`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
  });

  const content = completion.choices[0]?.message?.content || "Unable to generate content";

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

// run the scheduler
runDaily().catch((err) => {
  console.error("Scheduler error:", err);
  process.exit(1);
});
