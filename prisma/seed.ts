import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  {
    name: "Effects",
    subcategories: [
      "Bit Crusher",
      "Distortion",
      "Chorus",
      "Reverb",
      "Filter",
      "Delay",
      "Flanger",
      "Saturation",
      "EQ",
      "De-esser",
      "Multi-effect",
      "Tape Emulation",
      "Echo",
      "Compressor",
      "Vocals",
    ],
  },
  {
    name: "Instruments",
    subcategories: [
      "Drum Machine",
      "Synths",
      "Drums",
      "Sampler",
      "Piano",
      "Synth Presets",
      "Sampled Instrument",
    ],
  },
  {
    name: "Kits",
    subcategories: [
      "Piano",
      "Drums",
      "Synth",
      "Samples",
      "Guitar",
      "Presets",
      "Midi",
      "Vocals",
      "One Shot",
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
