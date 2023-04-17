import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { v4 as uuidv4 } from "uuid";

const REGION = "us-east-5";
const BACKBLAZE_ENDPOINT = `https://s3.us-east-005.backblazeb2.com`;

const client = new S3Client({
  credentials: {
    accessKeyId: env.BACKBLAZE_KEYID,
    secretAccessKey: env.BACKBLAZE_APPLICATION_KEY,
  },
  region: REGION,
  endpoint: BACKBLAZE_ENDPOINT,
});

export default async function uploadB2(file: string, bucket: string) {
  const buffer = Buffer.from(file, "base64");
  const key = uuidv4();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
  });

  try {
    await client.send(command);
    return key;
  } catch (err) {
    console.error("Upload to B2 failed", err);
    throw new Error("B2_UPLOAD_FAILED");
  }
}
