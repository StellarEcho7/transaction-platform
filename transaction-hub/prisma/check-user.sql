SELECT * FROM "user";
INSERT INTO "user" (id, email, name, password, role, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'test@test.com', 'Test', 'test', 'USER', NOW(), NOW());