import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductSchema } from "~/types/schema";

export const userProfileRouter = createTRPCRouter({
  updateProfilePicture: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      if (ctx.session.user.image) {
        await ctx.cloudinary.uploader.destroy(ctx.session.user.image);
      }

      const options = {
        unique_filename: true,
        overwrite: true,
        folder: `audiospace/user`,
      };

      const data = await ctx.cloudinary.uploader.upload(input.image, options);

      const load = ctx.prisma.user.update({
        where: {
          email: ctx.session.user.email,
        },
        data: {
          image: data.secure_url,
        },
      });

      return load;
    }),
  updateProfileUsername: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3, "Names must be longer than 3 characters."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUsername = await ctx.prisma.user.findFirst({
        where: {
          username: input.name,
        },
      });
      if (existingUsername?.username === ctx.session.user.name) {
        throw new Error("Username already taken.");
      }
      const data = ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          username: input.name,
        },
      });
      return data;
    }),
  updateProfileEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid Email.").min(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingEmail = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (existingEmail?.email === ctx.session.user.email) {
        throw new Error("Email already taken.");
      }
      const data = ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          email: input.email,
        },
      });
      return data;
    }),
  getWishlist: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        wishlist: {
          select: {
            id: true,
          },
        },
      },
    });
    const result = data.wishlist.map((el) => el.id);
    // console.log(ctx.session.user, "getwishlist");
    return result;
  }),
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        cart: {
          select: {
            id: true,
          },
        },
      },
    });
    const result = data.cart.map((el) => el.id);
    // console.log(data, "getwishlist");
    return result;
  }),
  getCartProducts: protectedProcedure
    // .output(z.object({ wishlist: z.array(ProductSchema) }))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          cart: {
            select: {
              id: true,
              seller: {
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              description: true,
              category: true,
              subcategory: true,
              name: true,
              images: true,
              price: true,
              previewUrl: true,
              discountRate: true,
            },
          },
        },
      });

      console.log({ data, id: ctx.session.user }, "getwishlist");
      return data;
    }),
  getWishlistProducts: protectedProcedure
    .output(z.object({ wishlist: z.array(ProductSchema) }))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.user.findFirstOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          wishlist: {
            select: {
              id: true,
              seller: {
                select: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              description: true,
              category: true,
              subcategory: true,
              name: true,
              images: true,
              price: true,
              previewUrl: true,
              discountRate: true,
            },
          },
        },
      });

      // console.log(data, "getwishlistproducts");
      return data;
    }),
  addProductToWishlist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const data = ctx.prisma.user.update({
        data: {
          wishlist: {
            connect: {
              id: input.id,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return data;
    }),
  deleteProductFromWishlist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const data = ctx.prisma.user.update({
        data: {
          wishlist: {
            disconnect: {
              id: input.id,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return data;
    }),
  addProductToCart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.update({
        data: {
          cart: {
            connect: {
              id: input.id,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },

        // select: {
        //   id: true,
        // },
      });
      console.log(data, input);
      return data;
    }),
  deleteProductFromCart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const data = ctx.prisma.user.update({
        data: {
          cart: {
            disconnect: {
              id: input.id,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
      return data;
    }),
  getPastBeatSubmissions: protectedProcedure.query(({ ctx }) => {
    const data = ctx.prisma.battleEntry.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return data;
  }),
});
