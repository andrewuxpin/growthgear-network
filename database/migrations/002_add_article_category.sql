-- Migration: Add category and image_alt columns to articles table
-- Run with: wrangler d1 execute growthgear-db --file=./database/migrations/002_add_article_category.sql

ALTER TABLE articles ADD COLUMN category TEXT;
ALTER TABLE articles ADD COLUMN image_alt TEXT;
