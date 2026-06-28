-- Migration 0005: Add lead_source and project_category columns to opportunities
-- These columns are referenced in the application code but were missing from the schema

ALTER TABLE opportunities ADD COLUMN lead_source TEXT DEFAULT '';
ALTER TABLE opportunities ADD COLUMN project_category TEXT DEFAULT '';
