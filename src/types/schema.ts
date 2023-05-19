import { z } from "zod";

export const ProductImageSchema = z.array(
  z.object({
    id: z.number(),
    imageUrl: z.string().url(),
    productId: z.string().optional(),
  })
);

export const SellerSchema = z.object({
  user: z.object({
    id: z.number().optional(),
    username: z.string(),
    image: z.string().nullable().optional(),
  }),
});

export const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
  _count: z
    .object({
      products: z.number(),
    })
    .nullable()
    .optional(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  subcategories: z.array(SubcategorySchema).optional(),
});

export const ProductSchema = z.object({
  id: z.string(),
  seller: SellerSchema,
  description: z.string().optional(),
  name: z.string(),
  images: ProductImageSchema,
  price: z.number(),
  rating: z.number().optional(),
  category: CategorySchema,
  subcategory: z.array(SubcategorySchema),
  wishlistUsers: z.array(z.unknown()).optional(),
});

export const TransactionProductSchema = z.object({
  id: z.string(),
  seller: SellerSchema,
  name: z.string(),
  images: ProductImageSchema,
});

export const UserSchema = z.object({
  id: z.string(),
  stripeCustomerId: z.string().optional(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.unknown().nullable(),
  password: z.string(),
  image: z.string().nullable(),
  wishlist: z.array(ProductSchema),
  accounts: z.array(z.unknown()),
  sessions: z.array(z.unknown()),
  transactions: z.array(z.unknown()),
  verifiedAt: z.string().nullable(),
});

export const BattleEntrySchema = z.object({
  battleId: z.number(),
  id: z.number(),
  rating: z.number(),
  trackUrl: z.string().url(),
  userId: z.string(),
  user: z.object({ username: z.string() }),
});

export const BattleSchema = z.object({
  id: z.number(),
  description: z.string(),
  createdAt: z.date(),
  winnerId: z.string().nullable(),
  sample: z.string().nullable(),
  isActive: z.enum(["ACTIVE", "ENDED", "VOTING"]),
});

export const Blob = z.object({
  id: z.number().optional(),
  data: z.string(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string().optional(),
  image: z.string().url(),
  author: z.string(),
  tagId: z.number().optional(),
  tag: z.object({
    id: z.number(),
    name: z.string(),
  }),
  createdAt: z.date(),
});

export const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  posts: z.array(PostSchema).optional(),
});

const TextMarkSchema = z.object({
  type: z.string(),
});

const TextContentSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  marks: z.array(TextMarkSchema).optional(),
});

const ContentSchema = z.object({
  type: z.string(),
  attrs: z.record(z.any()).optional(),
  content: z.array(TextContentSchema).optional(),
});

const TiptapSchema = z.object({
  type: z.string(),
  attrs: z.record(z.any()).optional(),
  content: z.array(ContentSchema).optional(),
});

const TiptapOutputSchema = z.array(TiptapSchema);

export type SellerSchema = z.infer<typeof SellerSchema>;
export type SubcategorySchema = z.infer<typeof SubcategorySchema>;
export type CategorySchema = z.infer<typeof CategorySchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;
export type TransactionProductSchema = z.infer<typeof TransactionProductSchema>;
export type UserSchema = z.infer<typeof UserSchema>;
export type BattleEntrySchema = z.infer<typeof BattleEntrySchema>;
export type BattleSchema = z.infer<typeof BattleSchema>;
export type PostSchema = z.infer<typeof PostSchema>;
export type TagSchema = z.infer<typeof TagSchema>;
export type TiptapOutputSchema = z.infer<typeof TiptapOutputSchema>;
