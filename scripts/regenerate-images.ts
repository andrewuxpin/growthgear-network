/**
 * Script to regenerate images for articles missing featured images
 *
 * Usage:
 *   npx tsx scripts/regenerate-images.ts
 *
 * Environment variables required:
 *   - CLOUDFLARE_ACCOUNT_ID
 *   - CLOUDFLARE_API_TOKEN
 *   - CLOUDFLARE_D1_DATABASE_ID (or uses default from wrangler.toml)
 *   - API_URL (e.g., https://growthgear-api.your-domain.workers.dev)
 *   - ADMIN_API_KEY
 */

const API_URL = process.env.API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

if (!API_URL || !ADMIN_API_KEY) {
  console.error("Missing required environment variables: API_URL, ADMIN_API_KEY");
  process.exit(1);
}

interface Article {
  id: number;
  title: string;
  primary_keyword: string;
  featured_image: string | null;
  site_id: string;
}

async function fetchArticles(onlyMissing: boolean = true): Promise<Article[]> {
  const response = await fetch(`${API_URL}/api/articles?limit=500`, {
    headers: {
      Authorization: `Bearer ${ADMIN_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch articles: ${response.statusText}`);
  }

  const data = await response.json() as { success: boolean; data: Article[] };

  if (onlyMissing) {
    return data.data.filter((article) => !article.featured_image);
  }
  return data.data;
}

function generateImagePrompt(title: string, keyword: string): string {
  // Map topics to specific visual scenes that are relevant but won't generate text
  const topicVisuals: Record<string, string[]> = {
    "email": [
      "hands typing on laptop keyboard with colorful envelope icons floating above screen, soft bokeh lights",
      "creative workspace with multiple screens showing inbox interface, warm desk lamp lighting",
      "person checking phone and laptop simultaneously, morning coffee steam rising, productive morning"
    ],
    "marketing": [
      "creative team brainstorming with colorful charts on whiteboard, modern agency office",
      "digital marketing dashboard on large monitor, analytics graphs glowing, dark modern office",
      "megaphone with colorful smoke trails emerging, product photography style on gradient background"
    ],
    "social media": [
      "multiple smartphones displaying various social app interfaces arranged in circle, top down view",
      "influencer recording content with ring light and professional setup, behind the scenes",
      "network of connected profile icons floating in 3D space, purple and blue gradient"
    ],
    "automation": [
      "robotic arm in modern factory with blue led lights, industrial photography",
      "flowing digital workflow visualization with glowing nodes and connections",
      "smart home devices arranged on table with interconnected light beams"
    ],
    "crm": [
      "sales team celebrating around computer showing growth dashboard, candid office moment",
      "customer service representative with headset smiling at screen, warm professional lighting",
      "interconnected customer profile cards floating in digital space, relationship network"
    ],
    "sales": [
      "confident salesperson shaking hands with client in modern glass office",
      "sales funnel visualization with golden coins flowing through stages",
      "business meeting with team reviewing charts on tablet, collaborative atmosphere"
    ],
    "pipeline": [
      "3D visualization of sales stages as connected glowing platforms, isometric view",
      "water flowing through transparent tubes representing business flow, artistic",
      "stacked deal cards progressing through illuminated stages, board game aesthetic"
    ],
    "ai": [
      "humanoid robot face with glowing blue neural patterns, dramatic lighting",
      "brain made of circuit boards and glowing synapses, macro photography style",
      "AI assistant hologram emerging from smartphone, futuristic living room"
    ],
    "chatbot": [
      "friendly robot assistant on computer screen helping customer, warm colors",
      "speech bubbles forming conversation pattern with digital assistant icon",
      "customer support chat interface with happy emoji reactions, clean UI"
    ],
    "machine learning": [
      "data scientist analyzing neural network visualization on multiple monitors",
      "abstract representation of algorithm learning with flowing data streams",
      "computer processing images with classification labels appearing, tech lab"
    ],
    "nlp": [
      "colorful word cloud forming brain shape, language and communication concept",
      "voice waveform transforming into structured data visualization",
      "multilingual conversation bubbles connecting across globe hologram"
    ],
    "writing": [
      "creative writer at vintage desk with modern laptop, inspiration mood board on wall",
      "AI and human hands collaborating on document, creative partnership concept",
      "magical quill pen writing on digital tablet with sparkle effects"
    ],
    "conversion": [
      "website visitor transforming into customer icon, funnel visualization",
      "A/B test comparison with winning variant highlighted in green glow",
      "shopping cart filling up with products, ecommerce success moment"
    ],
    "optimization": [
      "speedometer showing maximum performance with green indicators glowing",
      "website loading with blazing fast progress bar, speed lines effect",
      "engineer fine-tuning gears and dials on complex machine, precision work"
    ],
  };

  // Find matching visual based on keywords in title
  const lowerTitle = title.toLowerCase();
  for (const [topic, visuals] of Object.entries(topicVisuals)) {
    if (lowerTitle.includes(topic)) {
      // Pick a random visual from the options for variety
      return visuals[Math.floor(Math.random() * visuals.length)];
    }
  }

  // Default business visual with variety
  const defaults = [
    "modern startup office with team collaborating on innovative project",
    "entrepreneur working on laptop in stylish coworking space, natural light",
    "business strategy session with sticky notes and digital screens"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

async function generateImageForArticle(articleId: number, prompt: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        articleId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`  Failed to generate image for article ${articleId}: ${error}`);
      return false;
    }

    const data = await response.json() as { success: boolean; data?: { filename: string } };
    if (data.success && data.data?.filename) {
      console.log(`  Generated: ${data.data.filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`  Error generating image for article ${articleId}:`, error);
    return false;
  }
}

async function main() {
  // Check if we want to regenerate ALL images or just missing ones
  const regenerateAll = process.argv.includes("--all");

  console.log(regenerateAll
    ? "Fetching ALL articles to regenerate images...\n"
    : "Fetching articles without featured images...\n");

  const articles = await fetchArticles(!regenerateAll);

  if (articles.length === 0) {
    console.log("No articles to process!");
    return;
  }

  console.log(`Found ${articles.length} articles to process.\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const prompt = generateImagePrompt(article.title, article.primary_keyword);

    console.log(`[${i + 1}/${articles.length}] Processing: ${article.title}`);
    console.log(`  Prompt: ${prompt}`);

    const success = await generateImageForArticle(article.id, prompt);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Add a small delay between requests to avoid rate limiting
    if (i < articles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total processed: ${articles.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
