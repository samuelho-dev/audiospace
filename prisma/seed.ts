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

const sellersData = [
  {
    name: "Seller A",
    products: [
      {
        name: "BitCrusher Pro",
        categoryName: "Effects",
        subcategoryNames: ["Bit Crusher"],
        description:
          "A powerful bit crusher plugin to add character to your sound.",
        price: 49,
        preview_url: "https://example.com/bitcrusher-pro/preview",
        downloadUrl: "https://example.com/bitcrusher-pro/download",
      },
      {
        name: "Reverb Master",
        categoryName: "Effects",
        subcategoryNames: ["Reverb"],
        description: "A high-quality reverb plugin for professional sound.",
        price: 99,
        preview_url: "https://example.com/reverb-master/preview",
        downloadUrl: "https://example.com/reverb-master/download",
      },
    ],
  },
  {
    name: "Seller B",
    products: [
      {
        name: "Ultimate Compressor",
        categoryName: "Effects",
        subcategoryNames: ["Compressor"],
        description:
          "A versatile compressor plugin suitable for various music genres.",
        price: 79,
        preview_url: "https://example.com/ultimate-compressor/preview",
        downloadUrl: "https://example.com/ultimate-compressor/download",
      },
      {
        name: "Analog Synth",
        categoryName: "Instruments",
        subcategoryNames: ["Synths"],
        description:
          "A powerful virtual analog synthesizer with a warm and rich sound.",
        price: 149,
        preview_url: "https://example.com/analog-synth/preview",
        downloadUrl: "https://example.com/analog-synth/download",
      },
    ],
  },
  {
    name: "Seller C",
    products: [
      {
        name: "Epic Piano",
        categoryName: "Instruments",
        subcategoryNames: ["Piano"],
        description: "A realistic and expressive grand piano plugin.",
        price: 199,
        preview_url: "https://example.com/epic-piano/preview",
        downloadUrl: "https://example.com/epic-piano/download",
      },
      {
        name: "Virtual Strings",
        categoryName: "Instruments",
        subcategoryNames: ["Sampled Instrument"],
        description: "A lush and expressive virtual string ensemble.",
        price: 299,
        preview_url: "https://example.com/virtual-strings/preview",
        downloadUrl: "https://example.com/virtual-strings/download",
      },
    ],
  },
  {
    name: "Seller D",
    products: [
      {
        name: "Drum Machine Master",
        categoryName: "Instruments",
        subcategoryNames: ["Drum Machine"],
        description: "A powerful drum machine plugin for any genre.",
        price: 129,
        preview_url: "https://example.com/drum-machine-master/preview",
        downloadUrl: "https://example.com/drum-machine-master/download",
      },
      {
        name: "Space Delay",
        categoryName: "Effects",
        subcategoryNames: ["Delay"],
        description:
          "A creative delay plugin for ambient and experimental music.",
        price: 69,
        preview_url: "https://example.com/space-delay/preview",
        downloadUrl: "https://example.com/space-delay/download",
      },
    ],
  },
  {
    name: "Seller E",
    products: [
      {
        name: "Dynamic EQ",
        categoryName: "Effects",
        subcategoryNames: ["EQ"],
        description: "A powerful and precise dynamic equalizer plugin.",
        price: 99,
        preview_url: "https://example.com/dynamic-eq/preview",
        downloadUrl: "https://example.com/dynamic-eq/download",
      },
      {
        name: "Lo-Fi Dreams",
        categoryName: "Kits",
        subcategoryNames: ["Presets"],
        description: "A collection of lo-fi presets for various synths.",
        price: 39,
        preview_url: "https://example.com/lo-fi-dreams/preview",
        downloadUrl: "https://example.com/lo-fi-dreams/download",
      },
      {
        name: "Drums That Knock",
        categoryName: "Kits",
        subcategoryNames: ["Samples"],
        description: "A collection of lo-fi presets for various synths.",
        price: 39,
        preview_url: "https://example.com/lo-fi-dreams/preview",
        downloadUrl: "https://example.com/lo-fi-dreams/download",
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
  for (const sellerData of sellersData) {
    const seller = await prisma.seller.create({
      data: { name: sellerData.name },
    });

    for (const productData of sellerData.products) {
      const subcategories = await prisma.productSubcategory.findMany({
        where: { name: { in: productData.subcategoryNames } },
      });

      const subcategoryIds = subcategories.map((subcategory) => subcategory.id);

      const productCategory = await prisma.productCategory.findUnique({
        where: { name: productData.categoryName },
      });

      if (productCategory) {
        await prisma.product.create({
          data: {
            name: productData.name,
            categoryId: productCategory.id,
            description: productData.description,
            price: productData.price,
            preview_url: productData.preview_url,
            downloadUrl: productData.downloadUrl,
            sellerId: seller.id,
            subcategory: {
              connect: subcategoryIds.map((id) => ({ id })),
            },
          },
        });
      }
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
