export const TOPICS = [
  "technology",
  "history_culture",
  "cooking_food_science",
  "science_nature",
  "health_wellness",
  "personal_finance",
  "arts_creativity",
  "diy_life_hacks",
  "travel_geography",
  "language_literature",
] as const;

export type TopicKey = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<TopicKey, string> = {
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
