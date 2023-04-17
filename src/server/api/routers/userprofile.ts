import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
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
      try {
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
        await ctx.prisma.$disconnect();
        return load;
      } catch (error) {
        console.error(error, input);
      }
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid Email.").min(5),
        name: z.string().min(3, "Names must be longer than 3 characters."),
      })
    )
    .mutation(({ ctx, input }) => {
      const updateData = {
        email: input.email,
        name: input.name,
      };

      const data = ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: updateData,
      });
      return data;
    }),
});
