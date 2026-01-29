-- GrowthGear Network Database Schema
-- Cloudflare D1 (SQLite)

-- Sites
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  niche TEXT NOT NULL,
  theme_config TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Keywords
CREATE TABLE keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT REFERENCES sites(id),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER,
  status TEXT DEFAULT 'queued',
  assigned_article_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Articles
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT REFERENCES sites(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  primary_keyword TEXT,
  content TEXT,
  word_count INTEGER,
  status TEXT DEFAULT 'draft',
  published_at DATETIME,
  refreshed_at DATETIME,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_id INTEGER REFERENCES sponsors(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(site_id, slug)
);

-- Article Links (internal linking)
CREATE TABLE article_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_article_id INTEGER REFERENCES articles(id),
  to_article_id INTEGER REFERENCES articles(id),
  anchor_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sponsors
CREATE TABLE sponsors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sponsored Links
CREATE TABLE sponsored_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sponsor_id INTEGER REFERENCES sponsors(id),
  article_id INTEGER REFERENCES articles(id),
  target_url TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  utm_campaign TEXT,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content Refresh Log
CREATE TABLE refresh_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER REFERENCES articles(id),
  refreshed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  changes_summary TEXT
);

-- Scheduled Jobs
CREATE TABLE scheduled_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_type TEXT NOT NULL,
  site_id TEXT REFERENCES sites(id),
  status TEXT DEFAULT 'pending',
  scheduled_for DATETIME,
  completed_at DATETIME,
  error_message TEXT
);

-- Indexes for performance
CREATE INDEX idx_keywords_site_status ON keywords(site_id, status);
CREATE INDEX idx_articles_site_status ON articles(site_id, status);
CREATE INDEX idx_articles_published ON articles(published_at);
CREATE INDEX idx_scheduled_jobs_status ON scheduled_jobs(status, scheduled_for);
