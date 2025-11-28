# Database Migrations

This directory contains database migration files for NanoFlows Academy.

## Migration Files

### Option 1: Single Combined Migration (Recommended for New Databases)

**`complete_database_setup.sql`** - Contains all migrations in one file
- **Use when**: Setting up a new database from scratch
- **Benefits**: 
  - Execute all tables in one go
  - No need to remember order of migrations
  - Single file to backup and share
  - Easier for initial database setup

### Option 2: Individual Migration Files

If you prefer to run migrations individually:

1. `create_ai_tools_table.sql` - AI tools showcase tables
2. `create_jobs_table.sql` - Career/jobs tables (includes sample data)
3. `create_about_sections_table.sql` - About page dynamic content tables
4. `create_videos_table.sql` - Videos and resources tables (legacy support)
5. `create_elearning_tables.sql` - Complete e-learning system tables

## Prerequisites

**IMPORTANT**: Before running any migration, ensure these base tables exist:
- `users` table
- `courses` table

These are typically created during initial database setup.

## Usage

### Using the Combined Migration File (Recommended)

```bash
# Using psql
psql -U your_username -d your_database -f server/migrations/complete_database_setup.sql

# Using Node.js script (if you have one)
node server/run-migration.js server/migrations/complete_database_setup.sql
```

### Using Individual Migration Files

```bash
# Run in order (if needed)
psql -U your_username -d your_database -f server/migrations/create_ai_tools_table.sql
psql -U your_username -d your_database -f server/migrations/create_jobs_table.sql
psql -U your_username -d your_database -f server/migrations/create_about_sections_table.sql
psql -U your_username -d your_database -f server/migrations/create_videos_table.sql
psql -U your_username -d your_database -f server/migrations/create_elearning_tables.sql
```

## Important Notes

1. **Safe to Re-run**: All migrations use `IF NOT EXISTS`, so they're safe to run multiple times
2. **Order Independence**: Most tables are independent, but some depend on:
   - `users` table (must exist first)
   - `courses` table (must exist first)
   - `modules` (depends on `courses`)
   - `lessons` (depends on `modules` and `courses`)
3. **Sample Data**: The `create_jobs_table.sql` includes sample job postings. These are safe to insert multiple times due to `ON CONFLICT DO NOTHING`.

## Which Approach Should You Use?

- **Single Combined File**: Use when setting up a new database or when you want simplicity
- **Individual Files**: Use when you need granular control, want to track changes separately, or have a migration system that manages individual files

Both approaches work equally well! Choose based on your preference and workflow.

