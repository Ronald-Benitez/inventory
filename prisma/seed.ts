import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("admin", 10);

  await prisma.users.create({
    data: {
      name: "admin",
      password: pass,
    },
  });
}

main().then(async () => {
    await prisma.$disconnect();
}
).catch((e) => {
    console.error(e);
    process.exit(1);
});


