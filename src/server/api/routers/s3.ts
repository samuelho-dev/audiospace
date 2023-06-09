import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { ratelimit } from "~/server/redis/rateLimit";

export const b2Router = createTRPCRouter({
  getObjects: publicProcedure
    .input(z.object({ bucket: z.string() }))
    .query(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(
        (ctx.session && ctx.session.user.id) || ctx.ip || input.bucket
      );

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please try again in a second.",
        });
      }

      const { b2 } = ctx;

      const listObjectsCommand = new ListObjectsV2Command({
        Bucket: input.bucket,
      });

      const listObjectsOutput = await b2.send(listObjectsCommand);

      return listObjectsOutput.Contents ?? [];
    }),

  getStandardUploadPresignedUrl: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(
        (ctx.session && ctx.session.user.id) || ctx.ip || input.bucket
      );

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please try again in a second.",
        });
      }

      const { key } = input;
      const { b2 } = ctx;

      const putObjectCommand = new PutObjectCommand({
        Bucket: input.bucket,
        Key: key,
      });

      return await getSignedUrl(b2, putObjectCommand, { expiresIn: 3600 });
    }),

  getStandardDownloadPresignedUrl: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip || input.bucket);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please try again in a second.",
        });
      }

      const { key } = input;
      const { b2 } = ctx;
      if (!key) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sample does not exist.",
        });
      }
      const putObjectCommand = new GetObjectCommand({
        Bucket: input.bucket,
        Key: key,
      });
      const url = await getSignedUrl(b2, putObjectCommand, { expiresIn: 3600 });
      return url;
    }),
  completeMultipartUpload: publicProcedure
    .input(
      z.object({
        bucket: z.string(),
        key: z.string(),
        uploadId: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { key, uploadId, parts } = input;
      const { b2 } = ctx;

      const completeMultipartUploadCommand = new CompleteMultipartUploadCommand(
        {
          Bucket: input.bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: parts,
          },
        }
      );

      const completeMultipartUploadOutput = await b2.send(
        completeMultipartUploadCommand
      );

      return completeMultipartUploadOutput;
    }),
});
