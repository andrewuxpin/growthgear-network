#!/usr/bin/env node
/**
 * Generates images for articles that are missing them
 * Usage: ADMIN_API_KEY=your-key node scripts/generate-missing-images.mjs
 */

const API_URL = "https://growthgear-api.growthgear.workers.dev";

// Map article topics to image prompts (no text/words in prompts!)
function generateImagePrompt(title, siteId) {
  const lowerTitle = title.toLowerCase();

  // AI site prompts
  if (siteId === 'ai') {
    if (lowerTitle.includes('implement') || lowerTitle.includes('business')) {
      return "executive in modern glass office reviewing holographic data visualizations, blue ambient lighting, cinematic";
    }
    if (lowerTitle.includes('open source') || lowerTitle.includes('framework') || lowerTitle.includes('developer')) {
      return "developer workspace with multiple monitors showing colorful code, mechanical keyboard, dark room with RGB lighting";
    }
    if (lowerTitle.includes('vs') || lowerTitle.includes('difference')) {
      return "split screen visualization of robot and human brain side by side, neural connections glowing, futuristic lab";
    }
    if (lowerTitle.includes('computer vision')) {
      return "security camera with augmented reality overlay detecting objects, smart city at night, neon highlights";
    }
    if (lowerTitle.includes('data analysis') || lowerTitle.includes('analytics')) {
      return "data scientist examining 3D charts floating above desk, dark control room with multiple screens, blue glow";
    }
    if (lowerTitle.includes('recommendation')) {
      return "person browsing tablet with personalized content suggestions floating around, cozy living room, warm lighting";
    }
    if (lowerTitle.includes('ethics')) {
      return "diverse team in boardroom discussing around holographic brain model, glass walls, natural lighting";
    }
    if (lowerTitle.includes('deep learning') || lowerTitle.includes('neural')) {
      return "abstract visualization of deep neural network layers with glowing nodes and connections, dark background, purple and blue";
    }
    return "futuristic AI control room with holographic displays, operator analyzing data streams, blue ambient lighting";
  }

  // Sales site prompts
  if (siteId === 'sales') {
    if (lowerTitle.includes('objection')) {
      return "confident salesperson in negotiation meeting, modern conference room, dramatic side lighting";
    }
    if (lowerTitle.includes('lead generation') || lowerTitle.includes('b2b')) {
      return "sales funnel visualization with business professionals networking at conference, bright exhibition hall";
    }
    if (lowerTitle.includes('presentation')) {
      return "executive presenting to boardroom with large screen showing growth charts, glass office, city skyline";
    }
    if (lowerTitle.includes('account based') || lowerTitle.includes('abm')) {
      return "marketing team reviewing target account profiles on digital whiteboard, collaborative workspace, warm lighting";
    }
    if (lowerTitle.includes('conversion')) {
      return "sales dashboard showing upward trending graphs, celebration in modern office, natural light";
    }
    if (lowerTitle.includes('automation') || lowerTitle.includes('tools')) {
      return "CRM interface on large monitor with sales pipeline visualization, clean desk setup, soft lighting";
    }
    if (lowerTitle.includes('business development')) {
      return "handshake between business partners with city skyline in background, golden hour lighting";
    }
    if (lowerTitle.includes('consultative')) {
      return "consultant listening attentively to client in comfortable meeting room, plants and natural elements";
    }
    if (lowerTitle.includes('qualify') || lowerTitle.includes('bant')) {
      return "sales rep taking notes during discovery call, headset on, dual monitors showing CRM, home office";
    }
    return "successful sales team celebrating around conference table, modern office, high energy atmosphere";
  }

  // Marketing site prompts
  if (siteId === 'marketing') {
    if (lowerTitle.includes('organic') || lowerTitle.includes('traffic') || lowerTitle.includes('seo')) {
      return "marketing analytics dashboard showing traffic growth, marketer analyzing data, multiple screens, modern office";
    }
    if (lowerTitle.includes('content marketing') || lowerTitle.includes('b2b')) {
      return "content creator at desk with camera and microphone, editing software on screen, creative studio space";
    }
    if (lowerTitle.includes('google analytics')) {
      return "analyst reviewing website metrics on large curved monitor, clean minimalist desk, soft ambient lighting";
    }
    if (lowerTitle.includes('attribution')) {
      return "marketing team reviewing customer journey visualization on digital wall, data points connected, tech office";
    }
    if (lowerTitle.includes('ai tools') || lowerTitle.includes('automation')) {
      return "marketer using AI interface with automated campaign suggestions floating around screen, futuristic workspace";
    }
    if (lowerTitle.includes('landing page') || lowerTitle.includes('conversion')) {
      return "designer reviewing landing page layouts on tablet, A/B test results on nearby monitor, creative agency";
    }
    if (lowerTitle.includes('acquisition cost') || lowerTitle.includes('cac')) {
      return "finance and marketing team reviewing cost metrics on shared screen, whiteboard with calculations, bright office";
    }
    if (lowerTitle.includes('funnel') || lowerTitle.includes('sales funnel')) {
      return "visualization of marketing funnel with customers flowing through stages, digital marketing war room";
    }
    if (lowerTitle.includes('email') || lowerTitle.includes('ecommerce')) {
      return "ecommerce manager reviewing email campaign results, product photos nearby, organized workspace, ring light";
    }
    return "digital marketing command center with multiple screens showing campaign metrics, diverse team collaborating";
  }

  return "professional business team collaborating in modern office with technology, bright natural lighting";
}

async function generateImage(apiKey, articleId, prompt) {
  const response = await fetch(`${API_URL}/api/generate-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, articleId })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}

async function main() {
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey) {
    console.error('Error: ADMIN_API_KEY environment variable required');
    console.error('Usage: ADMIN_API_KEY=your-key node scripts/generate-missing-images.mjs');
    process.exit(1);
  }

  // Articles missing images (from database query)
  const articles = [
    { id: 11, siteId: 'ai', title: 'How to Implement AI in Business: A Complete Step-by-Step Guide for 2024' },
    { id: 12, siteId: 'ai', title: 'Best Open Source AI Frameworks 2024: Complete Developer Guide' },
    { id: 13, siteId: 'ai', title: 'AI vs Machine Learning: Key Differences Explained (2024 Guide)' },
    { id: 14, siteId: 'sales', title: 'How to Overcome Common Sales Objections Effectively: A Complete Guide' },
    { id: 15, siteId: 'sales', title: 'Best Lead Generation Strategies for B2B Companies: 12 Proven Methods' },
    { id: 16, siteId: 'sales', title: 'How to Create Winning Sales Presentation Templates: Complete Guide' },
    { id: 17, siteId: 'marketing', title: 'How to Increase Organic Website Traffic Fast: 15 Proven Strategies' },
    { id: 18, siteId: 'marketing', title: 'Best Content Marketing Strategies for B2B Companies' },
    { id: 19, siteId: 'marketing', title: 'How to Set Up Google Analytics 4: Complete Step-by-Step Guide' },
    { id: 20, siteId: 'ai', title: 'How to Choose AI Development Platform: Complete 2024 Guide' },
    { id: 21, siteId: 'ai', title: 'What is Computer Vision Applications: 15 Real-World Uses' },
    { id: 22, siteId: 'ai', title: 'Best AI Tools for Data Analysis: 15 Top Platforms' },
    { id: 23, siteId: 'sales', title: 'What Is Account Based Marketing for Sales: Complete Guide' },
    { id: 24, siteId: 'sales', title: 'How to Improve Sales Conversion Rates Quickly: 15 Proven Strategies' },
    { id: 25, siteId: 'sales', title: 'Best Sales Automation Tools for Startups: Complete Guide' },
    { id: 26, siteId: 'marketing', title: 'What Is Marketing Attribution Modeling Explained' },
    { id: 27, siteId: 'marketing', title: 'Best AI Tools for Digital Marketing Automation' },
    { id: 28, siteId: 'marketing', title: 'How to Optimize Landing Pages for Conversions: Complete Guide' },
    { id: 29, siteId: 'ai', title: 'How to Build AI Recommendation System: Complete Developer Guide' },
    { id: 30, siteId: 'ai', title: 'AI Ethics Considerations for Businesses: Complete Guide' },
    { id: 31, siteId: 'ai', title: 'What is Deep Learning Neural Networks: Complete Guide' },
    { id: 32, siteId: 'sales', title: 'How to Develop a Business Development Strategy Plan' },
    { id: 33, siteId: 'sales', title: 'What Is Consultative Selling Approach Benefits' },
    { id: 34, siteId: 'sales', title: 'How to Qualify Leads Using BANT Criteria: Complete Guide' },
    { id: 35, siteId: 'marketing', title: 'Customer Acquisition Cost Calculation and Optimization' },
    { id: 36, siteId: 'marketing', title: 'How to Create High Converting Sales Funnels' },
    { id: 37, siteId: 'marketing', title: 'Best Email Marketing Platforms for Ecommerce' },
  ];

  console.log(`Generating images for ${articles.length} articles...\n`);

  let success = 0;
  let failed = 0;

  for (const article of articles) {
    const prompt = generateImagePrompt(article.title, article.siteId);
    console.log(`[${article.id}] ${article.title.slice(0, 50)}...`);
    console.log(`    Prompt: ${prompt.slice(0, 60)}...`);

    try {
      const result = await generateImage(apiKey, article.id, prompt);
      if (result.success) {
        console.log(`    ✓ Generated: ${result.data.filename}\n`);
        success++;
      } else {
        console.log(`    ✗ Failed: ${result.error}\n`);
        failed++;
      }
    } catch (error) {
      console.log(`    ✗ Error: ${error.message}\n`);
      failed++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n✓ Done: ${success} generated, ${failed} failed`);
}

main().catch(console.error);
