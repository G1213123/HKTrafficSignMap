import crypto from 'crypto';
import { config as loadEnv } from 'dotenv';
import { createGcsStorageClient } from '../app/lib/gcsStorageClient.js';

loadEnv({ path: '.env.local' });

const bucketName = process.env.GCS_BUCKET_NAME || 'road-sign-factory-asset';
const prefix = 'public/data/svgs/';
const force = process.argv.includes('--force');
const downloadToken = process.env.NEXT_PUBLIC_FIREBASE_ASSET_DOWNLOAD_TOKEN || crypto.randomUUID();

const storage = createGcsStorageClient();
const bucket = storage.bucket(bucketName);
const [files] = await bucket.getFiles({ prefix });

let updated = 0;
let skipped = 0;

for (const file of files) {
  if (file.name.endsWith('/')) continue;

  const [metadata] = await file.getMetadata();
  const existingToken = metadata.metadata?.firebaseStorageDownloadTokens;
  const hasDownloadToken = existingToken
    ?.split(',')
    .map(token => token.trim())
    .includes(downloadToken);
  if (hasDownloadToken && !force) {
    skipped += 1;
    continue;
  }

  await file.setMetadata({
    contentType: metadata.contentType || 'image/svg+xml',
    cacheControl: metadata.cacheControl || 'public,max-age=31536000,immutable',
    metadata: {
      ...metadata.metadata,
      firebaseStorageDownloadTokens: downloadToken,
    },
  });
  updated += 1;
}

console.log(`Bucket updated in place: ${bucketName}`);
console.log(`Metadata updated: ${updated}; skipped: ${skipped}`);
console.log('Use this public environment variable in the deployed app:');
console.log(`NEXT_PUBLIC_FIREBASE_ASSET_DOWNLOAD_TOKEN=${downloadToken}`);