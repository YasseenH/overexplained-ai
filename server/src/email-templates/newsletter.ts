export function renderNewsletterEmail(
  topic: string,
  content: string,
  unsubscribeUrl: string
) {
  const brandName = "Overexplained";
  const topicLabel = getTopicLabel(topic);

  return {
    subject: `Your Daily ${topicLabel} Newsletter`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <div style="max-width: 600px; margin: auto;">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 10px 0; letter-spacing: -0.5px;">
              ${brandName}
            </h1>
            <p style="color: #e2e8f0; font-size: 16px; margin: 0; opacity: 0.9;">
              Your daily dose of knowledge and inspiration
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Topic Badge -->
          <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${topicLabel}
          </div>

          <!-- Newsletter Content -->
          <div style="color: #1a202c; line-height: 1.7; font-size: 16px;">
            ${formatNewsletterContent(content)}
          </div>

          <!-- Divider -->
          <hr style="border: none; height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 40px 0;">

          <!-- Footer -->
          <div style="text-align: center; color: #64748b; font-size: 14px;">
            <p style="margin: 0 0 20px 0;">
              Thanks for reading! This newsletter was crafted with AI to bring you fresh insights every day.
            </p>
            
            <!-- Unsubscribe Link -->
            <p style="margin: 0;">
              <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none; font-weight: 500;">
                Unsubscribe
              </a>
              <span style="margin: 0 8px;">•</span>
              <a href="#" style="color: #667eea; text-decoration: none; font-weight: 500;">
                Manage Preferences
              </a>
            </p>
          </div>

        </div>

        <!-- Bottom Spacing -->
        <div style="height: 40px;"></div>
      </body>
      </html>
    `,
  };
}

function getTopicLabel(topic: string): string {
  const topicLabels: Record<string, string> = {
    technology: "Technology",
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

function formatNewsletterContent(content: string): string {
  // Split content into paragraphs and format them
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return paragraphs
    .map((paragraph) => {
      const trimmed = paragraph.trim();

      // Check if it's a heading (starts with a number or is short and ends with colon)
      if (
        /^\d+\./.test(trimmed) ||
        (trimmed.length < 100 && trimmed.endsWith(":"))
      ) {
        return `<h2 style="color: #1a202c; font-size: 20px; font-weight: 600; margin: 30px 0 15px 0; padding-top: 20px; border-top: 2px solid #e2e8f0;">${trimmed}</h2>`;
      }

      // Check if it's a key takeaway or interesting fact
      if (
        trimmed.toLowerCase().includes("did you know") ||
        trimmed.toLowerCase().includes("fun fact") ||
        trimmed.toLowerCase().includes("takeaway")
      ) {
        return `<div style="background: linear-gradient(135deg, #f7fafc, #edf2f7); border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p style="margin: 0; color: #2d3748; font-weight: 500;">${trimmed}</p>
      </div>`;
      }

      // Regular paragraph
      return `<p style="margin: 0 0 20px 0; color: #4a5568;">${trimmed}</p>`;
    })
    .join("");
}
