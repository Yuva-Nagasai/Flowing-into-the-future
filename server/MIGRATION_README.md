# MySQL/TiDB Cloud Migration Guide

## Quick Start

### 1. Ensure MySQL Connection is Configured

Make sure your `server/.env` file has the MySQL/TiDB Cloud connection:

```env
DATABASE_URL="mysql://22i8ymnxhJWkWNg.root:ygo5sMWT2AKNF45D@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test"
```

Or use individual variables:
```env
MYSQLHOST="gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
MYSQLPORT="4000"
MYSQLUSER="22i8ymnxhJWkWNg.root"
MYSQLPASSWORD="ygo5sMWT2AKNF45D"
MYSQLDATABASE="test"
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Run the Migration

```bash
npm run migrate
```

Or directly:
```bash
node run-mysql-migration.js
```

## What the Migration Does

The migration script will:

1. ✅ Create all 24 database tables
2. ✅ Set up all foreign key relationships
3. ✅ Create all necessary indexes
4. ✅ Use `IF NOT EXISTS` so it's safe to run multiple times

## Tables Created

1. **users** - User accounts and authentication
2. **courses** - Course catalog
3. **purchases** - Course enrollments
4. **videos** - Legacy video support
5. **resources** - Course/module resources
6. **modules** - Course modules
7. **lessons** - Module lessons
8. **user_progress** - Student progress tracking
9. **certificates** - Course completion certificates
10. **notes** - Student notes
11. **discussions** - Course discussions
12. **discussion_replies** - Discussion replies
13. **quizzes** - Course quizzes
14. **quiz_attempts** - Quiz submissions
15. **assignments** - Course assignments
16. **assignment_submissions** - Assignment submissions
17. **payment_orders** - Razorpay payment orders
18. **notifications** - User notifications
19. **jobs** - Job postings
20. **ai_tools** - AI tools showcase
21. **about_sections** - About page content
22. **about_section_images** - About page images
23. **about_team_members** - Team members
24. **about_company_logos** - Client logos

## Troubleshooting

### Connection Errors

If you see connection errors:

1. **Check .env file** - Make sure MySQL credentials are correct
2. **Verify TiDB Cloud endpoint** - Ensure your endpoint is enabled
3. **Check network/firewall** - TiDB Cloud may require whitelisted IPs
4. **Test connection manually**:
   ```bash
   mysql -h gateway01.ap-southeast-1.prod.aws.tidbcloud.com -P 4000 -u 22i8ymnxhJWkWNg.root -p
   ```

### Table Already Exists Errors

The migration uses `IF NOT EXISTS`, so these errors should be ignored. If you see them, the tables already exist and that's fine.

### Foreign Key Errors

If you see foreign key constraint errors, it means:
- Tables are being created out of order
- A referenced table doesn't exist yet

The migration script handles this by creating tables in the correct order.

## Verification

After running the migration, verify tables were created:

```sql
SHOW TABLES;
```

You should see all 24 tables listed.

## Next Steps

After migration:

1. ✅ Create an admin user (if needed)
2. ✅ Start your server: `npm run dev`
3. ✅ Test the API endpoints

## Notes

- All UUIDs are stored as `CHAR(36)` in MySQL
- Arrays (TEXT[]) are stored as `JSON` in MySQL
- Timestamps use `DATETIME` instead of `TIMESTAMPTZ`
- The migration is idempotent - safe to run multiple times

