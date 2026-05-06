import { createGcsStorageClient } from './gcsStorageClient';

const DEFAULT_BUCKET_NAME = 'road-sign-factory-asset';
const DEFAULT_EXPIRES_MS = 15 * 60 * 1000;

export function toBucketObjectName(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') {
    return '';
  }

  const normalizedPath = assetPath.replace(/^\/+/, '');
  if (normalizedPath.startsWith('public/')) {
    return normalizedPath;
  }

  return `public/${normalizedPath}`;
}

export async function generateSignedUrlGoogle({
  objectName,
  bucketName = process.env.GCS_BUCKET_NAME || DEFAULT_BUCKET_NAME,
  expiresMs = DEFAULT_EXPIRES_MS,
} = {}) {
  if (!objectName) {
    throw new Error('Missing objectName for signed URL generation');
  }

  const storage = createGcsStorageClient();
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + expiresMs,
  };

  const [signedUrl] = await storage.bucket(bucketName).file(objectName).getSignedUrl(options);
  return signedUrl;
}