import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";

import { type Readable } from "stream";

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

async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

export default async function getB2File(key: string, bucket: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await client.send(command);
    const data = await streamToString(response.Body as Readable);
    return data;
  } catch (err) {
    console.error("Get B2 file failed", err);
    throw new Error("B2_Get_Failed");
  }
}
