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
    subject: `What Is ${topicLabel} and How Does It Work?`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Newsletter - ${topicLabel}</title>
        <style>
          .newsletter-container { max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
          .brand-name { font-size: 32px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: -1px; }
          .tagline { font-size: 18px; margin: 0; opacity: 0.9; font-weight: 300; }
          .main-content { background: #ffffff; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .topic-badge { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
          .topic-description { color: #64748b; font-size: 16px; margin-bottom: 30px; font-style: italic; }
          .content-section { margin-bottom: 30px; }
          .section-heading { color: #1e293b; font-size: 22px; font-weight: 600; margin: 25px 0 15px 0; padding-top: 20px; border-top: 2px solid #e2e8f0; }
          .content-paragraph { color: #334155; line-height: 1.7; font-size: 16px; margin: 0 0 20px 0; }
          .highlight-box { background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .highlight-text { margin: 0; color: #1e293b; font-weight: 500; }
          .key-takeaway { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px solid #f59e0b; padding: 25px; margin: 30px 0; border-radius: 12px; text-align: center; }
          .takeaway-text { margin: 0; color: #92400e; font-size: 18px; font-weight: 600; }
          .footer { text-align: center; color: #64748b; font-size: 14px; padding: 30px 0; border-top: 1px solid #e2e8f0; }
          .footer-links { margin: 20px 0; }
          .footer-links a { color: #667eea; text-decoration: none; font-weight: 500; margin: 0 10px; }
          .footer-links a:hover { text-decoration: underline; }
          .unsubscribe-link { color: #ef4444; }
          .unsubscribe-link:hover { text-decoration: underline; }
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

            <div class="key-takeaway">
              <p class="takeaway-text">Key Takeaway</p>
              <p class="takeaway-text">${extractKeyTakeaway(content)}</p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 20px 0;">
                Thanks for reading! This newsletter was crafted to make complex topics accessible and engaging.
              </p>
              
              <div class="footer-links">
                <a href="#" class="unsubscribe-link">Unsubscribe</a>
                <span style="margin: 0 8px;">•</span>
                <a href="#">Manage Preferences</a>
                <span style="margin: 0 8px;">•</span>
                <a href="#">Share This Newsletter</a>
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

      // main heading
      if (
        trimmed.startsWith("**HEADLINE**") ||
        trimmed.startsWith("**QUICK SUMMARY**")
      ) {
        return `<h1 style="color: #1e293b; font-size: 28px; font-weight: 700; margin: 30px 0 20px 0; text-align: center;">${trimmed
          .replace(/\*\*.*?\*\*/, "")
          .trim()}</h1>`;
      }

      // section heading
      if (
        trimmed.startsWith("**MAIN EXPLANATION**") ||
        trimmed.startsWith("**INTERESTING FACTS**") ||
        trimmed.startsWith("**REAL-WORLD APPLICATIONS**") ||
        trimmed.startsWith("**KEY TAKEAWAY**")
      ) {
        return `<h2 class="section-heading">${trimmed
          .replace(/\*\*.*?\*\*/, "")
          .trim()}</h2>`;
      }

      // bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        const items = trimmed
          .split("\n")
          .filter(
            (item) => item.trim().startsWith("-") || item.trim().startsWith("•")
          );
        if (items.length > 0) {
          const formattedItems = items
            .map(
              (item) =>
                `<li style="margin: 0 0 8px 0; color: #334155;">${item.replace(
                  /^[-•]\s*/,
                  ""
                )}</li>`
            )
            .join("");
          return `<ul style="margin: 20px 0; padding-left: 20px;">${formattedItems}</ul>`;
        }
      }

      // interesting facts
      if (
        trimmed.toLowerCase().includes("did you know") ||
        trimmed.toLowerCase().includes("fun fact") ||
        trimmed.toLowerCase().includes("fascinating") ||
        trimmed.toLowerCase().includes("surprising")
      ) {
        return `<div class="highlight-box">
          <p class="highlight-text">${trimmed}</p>
        </div>`;
      }

      return `<p class="content-paragraph">${trimmed}</p>`;
    })
    .join("");
}

function extractKeyTakeaway(content: string): string {
  const paragraphs = content.split("\n\n");
  for (const paragraph of paragraphs) {
    if (
      paragraph.includes("**KEY TAKEAWAY**") ||
      paragraph.toLowerCase().includes("bottom line") ||
      paragraph.toLowerCase().includes("key takeaway")
    ) {
      return paragraph.replace(/\*\*.*?\*\*/, "").trim();
    }
  }

  return "You've learned something new and fascinating today!";
}
