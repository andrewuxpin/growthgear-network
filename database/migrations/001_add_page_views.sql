-- Migration: Add page_views table for analytics tracking
-- Run with: wrangler d1 execute growthgear-db --file=./database/migrations/001_add_page_views.sql

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id TEXT REFERENCES sites(id),
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_page_views_site_date ON page_views(site_id, created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(site_id, path);
