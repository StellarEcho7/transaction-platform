-- List all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if user exists
SELECT * FROM "user";