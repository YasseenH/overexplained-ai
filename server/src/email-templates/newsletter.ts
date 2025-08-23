import { TOPIC_LABELS, getTopicDescription } from "../utils/topics";

export function renderNewsletterEmail(
  topic: string,
  content: string,
  unsubscribeUrl: string
) {
  const brandName = "Overexplained";
  const topicLabel = getTopicLabel(topic);
  const topicDescription = getTopicDescription(topic as any);

  return {
    subject: `Your Daily Dose: ${topicLabel}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Newsletter - ${topicLabel}</title>
        <style>
          .newsletter-container { max-width: 600px; margin: 0 auto; font-family: 'Times New Roman', Times, Georgia, 'Liberation Serif', serif; }
          .header { background: transparent; padding: 20px 0; text-align: center; color: inherit; }
          .brand-name { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px; color: #667eea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          .tagline { font-size: 16px; margin: 0; font-weight: 400; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          .main-content { background: #ffffff; padding: 30px 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .topic-badge { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          .topic-description { color: #64748b; font-size: 15px; margin-bottom: 25px; font-style: italic; }
          .content-section { margin-bottom: 25px; }
          
          /* Typography Hierarchy */
          .title-heading { color: #1e293b; font-size: 28px; font-weight: 700; margin: 30px 0 20px 0; text-align: left; line-height: 1.2; }
          .subtitle-heading { color: #1e293b; font-size: 20px; font-weight: 600; margin: 25px 0 15px 0; padding-top: 20px; border-top: 2px solid #e2e8f0; }
          .content-paragraph { color: #334155; line-height: 1.7; font-size: 16px; margin: 0 0 18px 0; }
          
          /* Highlight Box - Dark Theme Compatible */
          .highlight-box { background: #f8fafc; border: 2px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .highlight-text { margin: 0; color: #1e293b; font-weight: 500; }
          
          .key-takeaway { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 12px; text-align: center; }
          .takeaway-text { margin: 0; color: #92400e; font-size: 16px; font-weight: 600; }
          .footer { text-align: center; color: #64748b; font-size: 13px; padding: 25px 0; border-top: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          .footer-links { margin: 16px 0; }
          .footer-links a { color: #667eea; text-decoration: none; font-weight: 500; margin: 0 8px; }
          .footer-links a:hover { text-decoration: underline; }
          .unsubscribe-link { color: #ef4444; }
          .unsubscribe-link:hover { text-decoration: underline; }
          
          /* Mobile-first responsive design */
          @media (max-width: 600px) {
            .newsletter-container { margin: 0 10px; }
            .main-content { padding: 20px 15px; }
            .header { padding: 15px 0; }
            .brand-name { font-size: 24px; }
            .tagline { font-size: 14px; }
            .title-heading { font-size: 24px; margin: 25px 0 15px 0; }
            .subtitle-heading { font-size: 18px; margin: 20px 0 12px 0; }
            .content-paragraph { font-size: 15px; line-height: 1.6; }
            .topic-badge { font-size: 12px; padding: 6px 12px; }
            .topic-description { font-size: 14px; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc;">
        
        <div class="newsletter-container">
          <div class="header">
            <h1 class="brand-name">${brandName}</h1>
            <p class="tagline">Your daily dose of fascinating knowledge</p>
          </div>

          <div class="main-content">
            <div class="topic-badge">${topicLabel}</div>
            <p class="topic-description">${topicDescription}</p>
            
            <div class="content-section">
              ${formatEnhancedNewsletterContent(content)}
            </div>

            <div class="footer">
              <p style="margin: 0 0 20px 0;">
                Thanks for reading!
              </p>
              
              <div class="footer-links">
                <a href="#" class="unsubscribe-link">Unsubscribe</a>
              </div>
              
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #94a3b8;">
                Delivered by Overexplained
              </p>
            </div>

          </div>
        </div>

      </body>
      </html>
    `,
  };
}

function getTopicLabel(topic: string): string {
  const topicLabels: Record<string, string> = {
    technology: "Technology & Innovation",
    history_culture: "History & Culture",
    cooking_food_science: "Cooking & Food Science",
    science_nature: "Science & Nature",
    health_wellness: "Health & Wellness",
    personal_finance: "Personal Finance",
    arts_creativity: "Arts & Creativity",
    diy_life_hacks: "DIY & Life Hacks",
    travel_geography: "Travel & Geography",
    language_literature: "Language & Literature",
  };

  return topicLabels[topic] || topic;
}

function formatEnhancedNewsletterContent(content: string): string {
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return paragraphs
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      // removal of any weird artifacts
      const cleanParagraph = trimmed.replace(/^:\s*/, "");

      // skip very short paragraphs
      if (cleanParagraph.length < 5) {
        return "";
      }

      // title section
      if (cleanParagraph.startsWith("**TITLE**")) {
        const titleText = cleanParagraph
          .replace(/\*\*TITLE\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (titleText.length < 10) return "";
        return `<h1 class="title-heading">${titleText}</h1>`;
      }

      // introduction section
      if (cleanParagraph.startsWith("**INTRO**")) {
        const introText = cleanParagraph
          .replace(/\*\*INTRO\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (introText.length < 10) return "";
        return `<h2 class="subtitle-heading">Introduction</h2><p class="content-paragraph">${introText}</p>`;
      }

      // understanding section
      if (cleanParagraph.startsWith("**UNDERSTANDING**")) {
        const understandingText = cleanParagraph
          .replace(/\*\*UNDERSTANDING\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (understandingText.length < 10) return "";
        return `<h2 class="subtitle-heading">Understanding</h2><p class="content-paragraph">${understandingText}</p>`;
      }

      // real life examples section
      if (cleanParagraph.startsWith("**REAL LIFE**")) {
        const realLifeText = cleanParagraph
          .replace(/\*\*REAL LIFE\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (realLifeText.length < 10) return "";
        return `<h2 class="subtitle-heading">Real Life</h2><p class="content-paragraph">${realLifeText}</p>`;
      }

      // did you know section
      if (cleanParagraph.startsWith("**DID YOU KNOW**")) {
        const didYouKnowText = cleanParagraph
          .replace(/\*\*DID YOU KNOW\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (didYouKnowText.length < 10) return "";
        return `<h2 class="subtitle-heading">Did You Know?</h2><p class="content-paragraph">${didYouKnowText}</p>`;
      }

      // where we see this section
      if (cleanParagraph.startsWith("**WHERE WE SEE THIS**")) {
        const whereText = cleanParagraph
          .replace(/\*\*WHERE WE SEE THIS\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (whereText.length < 10) return "";
        return `<h2 class="subtitle-heading">Where We See This</h2><p class="content-paragraph">${whereText}</p>`;
      }

      // key takeaway section
      if (cleanParagraph.startsWith("**KEY TAKEAWAY**")) {
        const keyTakeawayText = cleanParagraph
          .replace(/\*\*KEY TAKEAWAY\*\*/, "")
          .replace(/^:\s*/, "")
          .trim();

        if (keyTakeawayText.length < 10) return "";
        return `<h2 class="subtitle-heading">Key Takeaway</h2><p class="content-paragraph">${keyTakeawayText}</p>`;
      }

      // regular content paragraphs (fallback for any content without markers)
      if (!cleanParagraph.startsWith("**")) {
        return `<p class="content-paragraph">${cleanParagraph}</p>`;
      }

      return "";
    })
    .filter((html) => html !== "")
    .join("");
}

function extractKeyTakeaway(content: string): string {
  const paragraphs = content.split("\n\n");

  // look for the key takeaway section
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];

    if (paragraph.includes("**KEY TAKEAWAY**")) {
      let keyTakeaway = paragraph
        .replace(/\*\*KEY TAKEAWAY\*\*/, "")
        .replace(/^:\s*/, "")
        .trim();

      // if this paragraph is truncated, try to get the next one
      if (keyTakeaway.length < 10 && i + 1 < paragraphs.length) {
        const nextParagraph = paragraphs[i + 1].trim();
        if (nextParagraph && !nextParagraph.startsWith("**")) {
          keyTakeaway = nextParagraph.replace(/^:\s*/, "").trim();
        }
      }

      return (
        keyTakeaway || "You've learned something new and fascinating today!"
      );
    }
  }

  // fallback: look for any paragraph that might contain the key takeaway
  for (const paragraph of paragraphs) {
    if (
      paragraph.toLowerCase().includes("the bottom line") ||
      paragraph.toLowerCase().includes("key takeaway") ||
      paragraph.toLowerCase().includes("in conclusion")
    ) {
      const cleanText = paragraph.replace(/^:\s*/, "").trim();
      if (cleanText.length > 20) {
        return cleanText;
      }
    }
  }

  return "You've learned something new and fascinating today!";
}
