import { z } from "zod";

export const ProductImageSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
});

export const SellerSchema = z.object({
  user: z.object({ id: z.number().optional(), username: z.string() }),
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
  description: z.string(),
  name: z.string(),
  images: z.array(z.unknown()),
  price: z.number(),
  preview_url: z.string().nullable().optional(),
  discount_rate: z.number(),
  category: CategorySchema,
  subcategory: z.array(SubcategorySchema),
  wishlist_users: z.array(z.unknown()).optional(),
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

export type SellerSchema = z.infer<typeof SellerSchema>;
export type SubcategorySchema = z.infer<typeof SubcategorySchema>;
export type CategorySchema = z.infer<typeof CategorySchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;
export type UserSchema = z.infer<typeof UserSchema>;
export type BattleEntrySchema = z.infer<typeof BattleEntrySchema>;
export type BattleSchema = z.infer<typeof BattleSchema>;
