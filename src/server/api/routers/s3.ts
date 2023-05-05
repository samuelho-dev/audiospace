import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import {
  GetObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import {
  getSignedUrl,
  S3RequestPresigner,
} from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

export const b2Router = createTRPCRouter({
  getObjects: publicProcedure
    .input(z.object({ bucket: z.string() }))
    .query(async ({ ctx, input }) => {
      const { b2 } = ctx;

      const listObjectsOutput = await b2.listObjectsV2({
        Bucket: input.bucket,
      });

      return listObjectsOutput.Contents ?? [];
    }),

  getStandardUploadPresignedUrl: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { b2 } = ctx;

      const putObjectCommand = new PutObjectCommand({
        Bucket: input.bucket,
        Key: key,
      });

      return await getSignedUrl(b2, putObjectCommand, { expiresIn: 3600 });
    }),

  getStandardDownloadPresignedUrl: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { b2 } = ctx;

      const putObjectCommand = new GetObjectCommand({
        Bucket: input.bucket,
        Key: key,
      });

      return await getSignedUrl(b2, putObjectCommand, { expiresIn: 3600 });
    }),

  getMultipartUploadPresignedUrl: publicProcedure
    .input(
      z.object({
        bucket: z.string(),
        key: z.string(),
        filePartTotal: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { key, filePartTotal } = input;
      const { b2 } = ctx;

      const uploadId = (
        await b2.createMultipartUpload({
          Bucket: input.bucket,
          Key: key,
        })
      ).UploadId;

      if (!uploadId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create multipart upload",
        });
      }

      const urls: Promise<{ url: string; partNumber: number }>[] = [];

      for (let i = 1; i <= filePartTotal; i++) {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: input.bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: i,
        });

        const url = getSignedUrl(b2, uploadPartCommand, {
          expiresIn: 3600,
        }).then((url) => ({
          url,
          partNumber: i,
        }));

        urls.push(url);
      }

      return {
        uploadId,
        urls: await Promise.all(urls),
      };
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

      const completeMultipartUploadOutput = await b2.completeMultipartUpload({
        Bucket: input.bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      });

      return completeMultipartUploadOutput;
    }),
});