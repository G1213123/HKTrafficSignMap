#!/usr/bin/env node
import crypto from 'crypto';
import { config as loadEnv } from 'dotenv';
import { createGcsStorageClient } from './gcsStorageClient.js';

loadEnv({ path: '.env.local' });

const bucketName = process.env.GCS_BUCKET_NAME || 'road-sign-factory-asset';
const fileName = process.argv[2] || 'public/data/svgs/TS_101.svg';
const serviceAccountEmail = process.env.GCS_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GCS_SERVICE_ACCOUNT_PRIVATE_KEY;

function printUsage() {
  console.log('Usage: node app/lib/generateSignedUrlGoogle.mjs [fileName]');
  console.log('Example: node app/lib/generateSignedUrlGoogle.mjs public/data/svgs/TS_101.svg');
}

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  printUsage();
  process.exit(0);
}

function buildMockSignedUrl() {
  const expires = Date.now() + 15 * 60 * 1000;
  const canonicalPath = `/${bucketName}/${fileName}`;
  const signature = crypto
    .createHash('sha256')
    .update([bucketName, fileName, serviceAccountEmail || '', privateKey || '', String(expires)].join('|'))
    .digest('hex');

  const params = new URLSearchParams({
    'X-Goog-Algorithm': 'GOOG4-RSA-SHA256',
    'X-Goog-Credential': `${serviceAccountEmail || 'mock-service-account'}/mock/credential-scope`,
    'X-Goog-Date': new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'),
    'X-Goog-Expires': '900',
    'X-Goog-SignedHeaders': 'host',
    'X-Goog-Signature': signature,
    'x-mock-signed-url': 'true',
  });

  return `https://storage.googleapis.com/${bucketName}/${fileName}?${params.toString()}`;
}

async function main() {
  const storage = createGcsStorageClient();

  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000,
  };

  console.log('Bucket:', bucketName);
  console.log('File:', fileName);

  try {
    const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);

    console.log('\nGenerated GET signed URL:');
    console.log(url);
    console.log('\nYou can use it with:');
    console.log(`curl '${url}'`);
    return;
  } catch (err) {
    console.warn('Google Cloud Storage could not generate a signed URL with the current env data.');
    console.warn(err && err.message ? err.message : err);
    console.log('\nMock signed URL (for testing only):');
    console.log(buildMockSignedUrl());
    console.log('\nThis mock URL is not usable against GCS, but it keeps the signing flow testable.');
  }
}

main().catch(err => {
  console.error('Failed to generate signed URL:');
  console.error(err);
  process.exit(1);
});