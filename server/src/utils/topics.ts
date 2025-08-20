export const TOPICS = [
  "technology",
  "history_culture",
  "cooking_food_science",
  "science_nature",
  "health_wellness",
  "personal_finance",
  "arts_creativity",
  "travel_geography",
  "language_literature",
] as const;

export type TopicKey = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<TopicKey, string> = {
  technology: "Technology & Innovation",
  history_culture: "History & Culture",
  cooking_food_science: "Cooking & Food Science",
  science_nature: "Science & Nature",
  health_wellness: "Health & Wellness",
  personal_finance: "Personal Finance",
  arts_creativity: "Arts & Creativity",
  travel_geography: "Travel & Geography",
  language_literature: "Language & Literature",
};

export const ENHANCED_TOPICS = {
  technology: {
    label: "Technology & Innovation",
    description: "Discover how cutting-edge tech works and shapes our future",
    subtopics: [
      "artificial_intelligence",
      "cybersecurity",
      "blockchain",
      "quantum_computing",
      "robotics",
      "virtual_reality",
      "internet_of_things",
      "machine_learning",
    ],
  },
  science_nature: {
    label: "Science & Nature",
    description:
      "Explore the wonders of the natural world and scientific discoveries",
    subtopics: [
      "space_exploration",
      "climate_science",
      "human_biology",
      "chemistry_everyday",
      "physics_explained",
      "evolution",
      "genetics",
      "ecology",
    ],
  },
  history_culture: {
    label: "History & Culture",
    description:
      "Journey through time and explore diverse cultures around the world",
    subtopics: [
      "ancient_civilizations",
      "world_war_ii",
      "art_history",
      "archaeology",
      "cultural_traditions",
      "historical_figures",
      "architectural_wonders",
      "social_movements",
    ],
  },
  health_wellness: {
    label: "Health & Wellness",
    description:
      "Understand your body and mind for better health and happiness",
    subtopics: [
      "nutrition_science",
      "mental_health",
      "exercise_physiology",
      "sleep_science",
      "stress_management",
      "preventive_medicine",
      "alternative_health",
      "aging_well",
    ],
  },
  personal_finance: {
    label: "Personal Finance",
    description: "Master money management and build financial security",
    subtopics: [
      "investing_basics",
      "budgeting",
      "credit_management",
      "retirement_planning",
      "tax_strategies",
      "real_estate",
      "cryptocurrency",
      "financial_literacy",
    ],
  },
  cooking_food_science: {
    label: "Cooking & Food Science",
    description:
      "Learn the science behind delicious food and cooking techniques",
    subtopics: [
      "food_chemistry",
      "cooking_techniques",
      "nutrition_facts",
      "food_preservation",
      "flavor_science",
      "baking_science",
      "food_safety",
      "culinary_history",
    ],
  },
  arts_creativity: {
    label: "Arts & Creativity",
    description: "Discover the creative process and artistic expression",
    subtopics: [
      "art_techniques",
      "music_theory",
      "creative_writing",
      "design_principles",
      "film_making",
      "photography",
      "crafts",
      "artistic_movements",
    ],
  },
  travel_geography: {
    label: "Travel & Geography",
    description: "Explore the world's wonders and understand our planet",
    subtopics: [
      "world_geography",
      "travel_tips",
      "cultural_exchange",
      "natural_wonders",
      "urban_exploration",
      "sustainable_travel",
      "geography_facts",
      "adventure_travel",
    ],
  },
  language_literature: {
    label: "Language & Literature",
    description: "Explore the power of words and storytelling across cultures",
    subtopics: [
      "linguistics",
      "writing_techniques",
      "classic_literature",
      "poetry",
      "language_learning",
      "communication",
      "storytelling",
      "literary_analysis",
    ],
  },
} as const;

// get random subtopic for a given topic
export function getRandomSubtopic(topic: TopicKey): string {
  const topicData = ENHANCED_TOPICS[topic];
  if (!topicData?.subtopics?.length) {
    return topic;
  }
  const randomIndex = Math.floor(Math.random() * topicData.subtopics.length);
  return topicData.subtopics[randomIndex];
}

// get topic description
export function getTopicDescription(topic: TopicKey): string {
  return (
    ENHANCED_TOPICS[topic]?.description || "Learn something new and fascinating"
  );
}
