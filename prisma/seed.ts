import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  {
    name: "Effects",
    subcategories: [
      "Distortion",
      "Chorus",
      "Reverb",
      "Delay",
      "Flanger",
      "Saturation",
      "EQ",
      "Tape Emulation",
      "Echo",
      "Compressor",
    ],
  },
  {
    name: "Instruments",
    subcategories: [
      "Drum Machine",
      "Synths",
      "Sampler",
      "Piano",
      "Sampled Instrument",
    ],
  },
  {
    name: "Kits",
    subcategories: [
      "Piano",
      "Drums",
      "Synth",
      "Synth Presets",
      "Samples",
      "Guitar",
      "Presets",
      "Midi",
      "Vocals",
      "One Shot",
      "Ambient",
      "Percussion",
    ],
  },
];
const tags = [
  { name: "FEATURED" },
  { name: "DEVLOG" },
  { name: "SPOTLIGHT" },
  { name: "CULTURE" },
];

async function seedCategoriesAndSubcategories() {
  for (const categoryData of categories) {
    const category = await prisma.productCategory.create({
      data: { name: categoryData.name },
    });

    for (const subcategoryName of categoryData.subcategories) {
      await prisma.productSubcategory.create({
        data: {
          name: subcategoryName,
          categoryId: category.id,
        },
      });
    }
  }

  for (const blogTag of tags) {
    await prisma.tag.create({
      data: {
        name: blogTag.name,
      },
    });
  }
}

async function main() {
  await seedCategoriesAndSubcategories();
  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
