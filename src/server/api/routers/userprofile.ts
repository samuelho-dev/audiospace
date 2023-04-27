import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductSchema } from "~/types/schema";
import cloudinary from "~/utils/cloudinary";
import uploadCloudinary from "~/utils/uploadCloudinary";

const sessionSchema = z.object({
  user: z.object({
    image: z.string(),
    email: z.string().email(),
  }),
});

export const userProfileRouter = createTRPCRouter({
  updateProfilePicture: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const parsedSession = sessionSchema.parse(ctx.session);

      if (parsedSession.user.image) {
        await cloudinary.uploader.destroy(parsedSession.user.image);
      }

      const data = await uploadCloudinary([input.image], "audiospace/user");

      const load = ctx.prisma.user.update({
        where: {
          email: parsedSession.user.email,
        },
        data: {
          image: data[0]?.imageUrl,
        },
      });

      return load;
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid Email.").min(5),
        name: z.string().min(3, "Names must be longer than 3 characters."),
      })
    )
    .mutation(({ ctx, input }) => {
      const data = ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          email: input.email,
          username: input.name,
        },
      });
      return data;
    }),

  // updatePassword: protectedProcedur.mutation(({ctx, input}) => {

  // }),
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

      console.log(data, "getwishlist");
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
});
