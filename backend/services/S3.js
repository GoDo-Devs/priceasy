import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export async function checkIfExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch (err) {
    if (err.name === "NotFound") return false;
    throw err;
  }
}

export async function uploadPdfToS3(key, buffer) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
  });
  await s3.send(command);
}

export async function getPdfFromS3(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const data = await s3.send(command);

  return new Promise((resolve, reject) => {
    const chunks = [];
    data.Body.on("data", (chunk) => chunks.push(chunk));
    data.Body.on("end", () => resolve(Buffer.concat(chunks)));
    data.Body.on("error", reject);
  });
}

export async function uploadMetaToS3(key, hash) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify({ hash }),
    ContentType: "application/json",
  });
  await s3.send(command);
}

export async function getMetaFromS3(key) {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const data = await s3.send(command);

    const chunks = [];
    for await (const chunk of data.Body) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    return JSON.parse(buffer.toString("utf-8"));
  } catch (err) {
    if (err.name === "NoSuchKey" || err.name === "NotFound") return null;
    throw err;
  }
}
