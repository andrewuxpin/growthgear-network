/**
 * Fix broken images for old articles
 * Generates new images via the API and updates markdown frontmatter
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "https://growthgear-api.growthgear.workers.dev";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY!;
const SITES_DIR = path.resolve(__dirname, "../sites");

const BROKEN_IMAGE_PATTERN = /growthgear-api\.growthgear\.workers\.dev\/api\/images\/17(69|70)/;

interface ArticleFile {
  filePath: string;
  siteId: string;
  title: string;
  oldImageUrl: string;
}

function findBrokenArticles(): ArticleFile[] {
  const articles: ArticleFile[] = [];
  const siteIds = ["ai", "sales", "marketing", "hub"];

  for (const siteId of siteIds) {
    const articlesDir = path.join(SITES_DIR, siteId, "src/content/articles");
    if (!fs.existsSync(articlesDir)) continue;

    for (const file of fs.readdirSync(articlesDir)) {
      if (!file.endsWith(".md")) continue;
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      if (BROKEN_IMAGE_PATTERN.test(content)) {
        const titleMatch = content.match(/^title:\s*"(.+?)"/m);
        const imageMatch = content.match(/src:\s*"(https:\/\/growthgear-api[^"]+)"/);
        if (titleMatch && imageMatch) {
          articles.push({
            filePath,
            siteId,
            title: titleMatch[1],
            oldImageUrl: imageMatch[1],
          });
        }
      }
    }
  }
  return articles;
}

function generatePrompt(title: string, siteId: string): string {
  const prompts: Record<string, string[]> = {
    ai: [
      "developer workspace with multiple monitors showing code and neural network visualizations",
      "futuristic AI interface with holographic data displays in modern office",
      "data scientist examining 3D charts floating above desk in tech office",
    ],
    sales: [
      "confident salesperson shaking hands with client in modern glass office",
      "sales team reviewing CRM dashboard on large screen in meeting room",
      "professional business negotiation in sleek corporate boardroom",
    ],
    marketing: [
      "digital marketing analytics dashboard glowing on monitor in dark modern office",
      "creative team brainstorming around whiteboard with campaign visuals",
      "marketer analyzing funnel metrics on tablet in bright coworking space",
    ],
    hub: [
      "modern startup office with team collaborating on innovative project",
      "business strategy session with sticky notes and digital screens",
      "entrepreneur working at standing desk with city skyline view",
    ],
  };

  const sitePrompts = prompts[siteId] || prompts.hub;
  const base = sitePrompts[Math.floor(Math.random() * sitePrompts.length)];
  return `${base}, photorealistic, professional photography, sharp focus, cinematic lighting`;
}

async function generateImage(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      console.error(`  API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = (await res.json()) as { success: boolean; data: { url: string } };
    return data.success ? `${API_URL}${data.data.url}` : null;
  } catch (err) {
    console.error(`  Fetch error:`, err);
    return null;
  }
}

function updateMarkdown(filePath: string, oldUrl: string, newUrl: string): void {
  let content = fs.readFileSync(filePath, "utf-8");
  content = content.replace(oldUrl, newUrl);
  fs.writeFileSync(filePath, content, "utf-8");
}

async function main() {
  if (!ADMIN_API_KEY) {
    console.error("Missing ADMIN_API_KEY env var");
    process.exit(1);
  }

  const articles = findBrokenArticles();
  console.log(`Found ${articles.length} articles with broken images.\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`[${i + 1}/${articles.length}] ${article.title.slice(0, 60)}...`);

    const prompt = generatePrompt(article.title, article.siteId);
    console.log(`  Prompt: ${prompt.slice(0, 80)}...`);

    const newUrl = await generateImage(prompt);
    if (newUrl) {
      updateMarkdown(article.filePath, article.oldImageUrl, newUrl);
      console.log(`  Updated: ${newUrl.split("/").pop()}`);
      success++;
    } else {
      console.log(`  FAILED`);
      failed++;
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total: ${articles.length}`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main();
