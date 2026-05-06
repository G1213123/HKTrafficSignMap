import { Storage } from '@google-cloud/storage';

function normalizePrivateKey(value) {
  return value?.replace(/\\n/g, '\n');
}

function looksLikePemKey(value) {
  return typeof value === 'string' && value.includes('BEGIN PRIVATE KEY');
}



export function createGcsStorageClient() {
  const projectId = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
  const clientEmail = process.env.GCS_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GCS_SERVICE_ACCOUNT_PRIVATE_KEY);

  // Prefer env-provided service account credentials when available.
  if (clientEmail && privateKey && looksLikePemKey(privateKey)) {
    return new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  // Fall back to ADC (GOOGLE_APPLICATION_CREDENTIALS or attached service account).
  return new Storage({ projectId });
}
