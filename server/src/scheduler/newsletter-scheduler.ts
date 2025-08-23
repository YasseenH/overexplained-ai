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

Create a newsletter article that follows this EXACT structure with these EXACT markers:

**TITLE**: Write a compelling, question-based headline like "What Is [Topic] and How Does It Work?" or "How Does [Topic] Actually Work?" Make it curiosity-driven and specific.

**INTRO**: Write 2-3 sentences that hook the reader and clearly state what they'll learn and why it matters.

**UNDERSTANDING**: Write 2-3 paragraphs explaining the basics. Start with "What is [topic]?" and break down how it works in simple terms using analogies and real-world examples.

**REAL LIFE**: Write 1-2 paragraphs with concrete examples and scenarios that people can relate to in their daily lives.

**DID YOU KNOW**: Write 2-3 paragraphs with fascinating facts, historical context, and surprising applications. Use "Did you know..." and "Here's the fascinating part..." to introduce facts.

**WHERE WE SEE THIS**: Write 1-2 paragraphs about practical applications and real-world use cases that make the topic relevant to everyday life.

**KEY TAKEAWAY**: Write 1 clear, memorable sentence that summarizes the main learning.

Requirements:
- Length: 800-1200 words (5-8 minute read)
- Tone: Conversational, curious, and engaging - like explaining to a smart friend
- Language: Simple enough for a high school student to understand
- Examples: Use concrete, relatable analogies and real-world scenarios
- Structure: Follow the EXACT markers above - no variations

Writing Style:
- Use clear, direct language and avoid complex terminology
- Aim for a Flesch reading score of 80 or higher
- Use the active voice
- Avoid adverbs
- Do not use m-dashes or em-dashes
- Avoid AI markers or overly formal language
- Avoid buzzwords and instead use plain English
- Use jargon only where relevant and immediately explain it
- Avoid being salesy or overly enthusiastic and instead express calm confidence
- Write like a knowledgeable friend explaining something fascinating
- Keep sentences concise and paragraphs focused
- Use "Think of it like..." for analogies that make complex ideas simple
- Include "Here's the fascinating part..." for interesting facts
- End with "The bottom line is..." for key takeaways

Formatting Rules:
- Do NOT start any paragraph with a colon (:)
- Do NOT use bold formatting in the content text
- Only use the EXACT section markers listed above
- Use plain text for all content paragraphs
- Do NOT use bullet points (- or •) anywhere in the content
- Write all content as flowing paragraphs, even for lists of facts
- Ensure clean paragraph breaks between sections
- Each section should flow naturally from one paragraph to the next

Remember: This should feel like a daily dose of fascinating knowledge that readers look forward to with their morning coffee. Make complex topics feel accessible and exciting while maintaining a calm, confident tone. Write everything as natural paragraphs, not as lists or bullet points.`;

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

// export the function for manual execution
export { runDaily };
