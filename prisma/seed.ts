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
];

const sellers = [
  {
    name: "Seller A",
    products: [
      {
        name: "BitCrusher Pro",
        categoryId: 1, // Effects
        subcategories: [1], //
        description:
          "A powerful bit crusher plugin to add character to your sound.",
        price: 49,
        preview_url: "https://example.com/bitcrusher-pro/preview",
        downloadUrl: "https://example.com/bitcrusher-pro/download",
      },
    ],
  },
  {
    name: "Seller B",
    products: [
      {
        name: "Reverb Master",
        categoryId: 1, // Effects
        subcategories: [4],
        description:
          "High-quality reverb plugin for creating immersive soundscapes.",
        price: 99,
        preview_url: "https://example.com/reverb-master/preview",
        downloadUrl: "https://example.com/reverb-master/download",
      },
    ],
  },
  {
    name: "Seller C",
    products: [
      {
        name: "Drum Beast",
        categoryId: 2, // Instruments
        subcategories: [7], //
        description:
          "A comprehensive sampled drum library with a variety of kits and styles.",
        price: 149,
        preview_url: "https://example.com/drum-beast/preview",
        downloadUrl: "https://example.com/drum-beast/download",
      },
    ],
  },
  {
    name: "Seller D",
    products: [
      {
        name: "Piano Virtuoso",
        categoryId: 2, // Instruments
        subcategories: [5],
        description:
          "A beautifully sampled grand piano with realistic dynamics and articulations.",
        price: 199,
        preview_url: "https://example.com/piano-virtuoso/preview",
        downloadUrl: "https://example.com/piano-virtuoso/download",
      },
    ],
  },
  {
    name: "Seller E",
    products: [
      {
        name: "SynthMaster",
        categoryId: 2, // Instruments
        subcategories: [2],
        description:
          "A versatile synthesizer plugin with a massive collection of presets and sound design capabilities.",
        price: 249,
        preview_url: "https://example.com/synthmaster/preview",
        downloadUrl: "https://example.com/synthmaster/download",
      },
    ],
  },
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
}

async function seedSellersAndProducts() {
  for (const sellerData of sellers) {
    const seller = await prisma.seller.create({
      data: { name: sellerData.name },
    });

    for (const productData of sellerData.products) {
      await prisma.product.create({
        data: {
          name: productData.name,
          categoryId: productData.categoryId,
          description: productData.description,
          price: productData.price,
          preview_url: productData.preview_url,
          downloadUrl: productData.downloadUrl,
          sellerId: seller.id,
          subcategory: {
            connect: productData.subcategories.map((subcategoryId) => ({
              id: subcategoryId,
            })),
          },
        },
      });
    }
  }
}

async function main() {
  await seedCategoriesAndSubcategories();
  await seedSellersAndProducts();
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
