import { z } from "zod";

export const SellerSchema = z.object({
  id: z.number(),
  name: z.string(),
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
  id: z.number(),
  seller: SellerSchema,
  name: z.string(),
  images: z.array(z.unknown()),
  category: CategorySchema,
  subcategory: z.array(SubcategorySchema),
  price: z.number(),
  preview_url: z.string().nullable(),
  discount_rate: z.number(),
  wishlist_users: z.array(z.unknown()),
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

export type SellerSchema = z.infer<typeof SellerSchema>;
export type SubcategorySchema = z.infer<typeof SubcategorySchema>;
export type CategorySchema = z.infer<typeof CategorySchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;
export type UserSchema = z.infer<typeof UserSchema>;