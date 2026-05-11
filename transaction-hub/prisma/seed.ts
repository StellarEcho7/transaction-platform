import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "./client";

const SALT_ROUNDS = 12;

async function main() {
  const password = await bcrypt.hash("admin123", SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.email} (role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
