import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Insert default student groups
  await prisma.studentGroup.deleteMany();
  await prisma.studentGroup.createMany({
    data: [
      {
        id: "webkom",
        name: "Webkom",
      },
      {
        id: "hovedstyret",
        name: "Hovedstyret",
      },
      {
        id: "bedkom",
        name: "Bedkom",
      },
      {
        id: "gnist",
        name: "Gnist",
      },
      {
        id: "makerspace",
        name: "Makerspace",
      },
      {
        id: "tilde",
        name: "Tilde",
      },
      {
        id: "hyggkom",
        name: "Hyggkom",
      },
      {
        id: "esc",
        name: "ESC",
      },
      {
        id: "programmerbar",
        name: "Programmerbar",
      },
    ],
  });
}

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("✅ Seed complete.");
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.log("❌ Seed failed.");
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
