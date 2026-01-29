const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:8787";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const apiKey = localStorage.getItem("admin_api_key") || "";

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  });

  return response.json();
}

export const api = {
  // Sites
  getSites: () => fetchApi<Site[]>("/api/sites"),
  createSite: (data: Partial<Site>) =>
    fetchApi<{ id: string }>("/api/sites", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Keywords
  getKeywords: (siteId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (siteId) params.set("site_id", siteId);
    if (status) params.set("status", status);
    return fetchApi<Keyword[]>(`/api/keywords?${params}`);
  },
  createKeyword: (data: Partial<Keyword>) =>
    fetchApi<{ id: number }>("/api/keywords", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Articles
  getArticles: (siteId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (siteId) params.set("site_id", siteId);
    if (status) params.set("status", status);
    return fetchApi<Article[]>(`/api/articles?${params}`);
  },
  getArticle: (id: number) => fetchApi<Article>(`/api/articles/${id}`),
  updateArticle: (id: number, data: Partial<Article>) =>
    fetchApi(`/api/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Generation
  generateArticle: (data: GenerateRequest) =>
    fetchApi<{ id: number; article: GeneratedArticle }>("/api/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Stats
  getStats: () => fetchApi<Stats>("/api/stats"),
};

export interface Site {
  id: string;
  name: string;
  domain: string | null;
  niche: string;
}

export interface Keyword {
  id: number;
  site_id: string;
  keyword: string;
  search_volume: number | null;
  difficulty: number | null;
  status: string;
  assigned_article_id: number | null;
}

export interface Article {
  id: number;
  site_id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  primary_keyword: string | null;
  content: string | null;
  word_count: number | null;
  status: string;
  published_at: string | null;
  is_sponsored: boolean;
}

export interface GenerateRequest {
  keyword: string;
  siteId: string;
  niche: string;
  articleType: string;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  content: string;
  wordCount: number;
}

export interface Stats {
  totalSites: number;
  articles: Record<string, number>;
  keywords: Record<string, number>;
}
