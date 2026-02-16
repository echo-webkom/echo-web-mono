import path from "node:path";

const imagesDir = path.join(__dirname, "images");

export const companies = [
  {
    _id: "seed-company-bekk",
    _type: "company",
    name: "Bekk",
    website: "https://bekk.no",
    imagePath: path.join(imagesDir, "bekk.png"),
  },
  {
    _id: "seed-company-computas",
    _type: "company",
    name: "Computas",
    website: "https://computas.com",
    imagePath: path.join(imagesDir, "computas.png"),
  },
  {
    _id: "seed-company-sportradar",
    _type: "company",
    name: "Sportradar",
    website: "https://sportradar.com",
    imagePath: path.join(imagesDir, "sportradar.png"),
  },
  {
    _id: "seed-company-dnb",
    _type: "company",
    name: "DNB",
    website: "https://dnb.no",
    imagePath: path.join(imagesDir, "dnb.png"),
  },
  {
    _id: "seed-company-jetbrains",
    _type: "company",
    name: "JetBrains",
    website: "https://jetbrains.com",
    imagePath: path.join(imagesDir, "jetbrains.png"),
  },
];
