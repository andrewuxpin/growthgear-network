export interface ImageGeneratorConfig {
  accountId: string;
  apiToken: string;
}

export interface GeneratedImage {
  data: ArrayBuffer;
  contentType: string;
  prompt: string;
}

export class ImageGenerator {
  private accountId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor(config: ImageGeneratorConfig) {
    this.accountId = config.accountId;
    this.apiToken = config.apiToken;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/ai/run`;
  }

  async generateImage(prompt: string): Promise<GeneratedImage> {
    // Use Stable Diffusion XL for high quality images
    const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";

    const response = await fetch(`${this.baseUrl}/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: this.enhancePrompt(prompt),
        num_steps: 20,
        guidance: 7.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Image generation failed: ${error}`);
    }

    const data = await response.arrayBuffer();

    return {
      data,
      contentType: "image/png",
      prompt,
    };
  }

  private enhancePrompt(prompt: string): string {
    // Enhance the prompt for better image quality
    return `${prompt}, professional photography, high quality, detailed, sharp focus, well-lit, 4k`;
  }
}

// For use within Cloudflare Workers with AI binding
export class WorkerImageGenerator {
  private ai: Ai;

  constructor(ai: Ai) {
    this.ai = ai;
  }

  async generateImage(prompt: string): Promise<GeneratedImage> {
    const enhancedPrompt = `${prompt}, professional photography, high quality, detailed, sharp focus, well-lit, 4k`;

    const response = await this.ai.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      {
        prompt: enhancedPrompt,
        num_steps: 20,
        guidance: 7.5,
      }
    );

    // Response is a ReadableStream, convert to ArrayBuffer
    const data = response as unknown as Uint8Array;

    return {
      data: data.buffer,
      contentType: "image/png",
      prompt,
    };
  }
}

// Type declaration for Cloudflare AI binding
interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}
