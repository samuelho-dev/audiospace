import { S3 } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

const REGION = "us-east-5";
const BACKBLAZE_ENDPOINT = `https://s3.us-east-005.backblazeb2.com`;

export const b2 = new S3({
  region: REGION,
  endpoint: BACKBLAZE_ENDPOINT,
  credentials: {
    accessKeyId: env.BACKBLAZE_KEYID,
    secretAccessKey: env.BACKBLAZE_APPLICATION_KEY,
  },
});
