import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString,
  // @ts-expect-error - pg v8+ uses different Pool type
  pool: new Pool({ connectionString }),
});

const prisma = new PrismaClient({ adapter });

export default prisma;
