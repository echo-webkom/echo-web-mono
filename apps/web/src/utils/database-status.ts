import { prisma } from "@echo-webkom/db";

export async function getDatabaseStatus() {
  try {
    const resp = await prisma.$queryRaw`SELECT 1`;
    return !!resp;
  } catch (e) {
    return false;
  }
}
