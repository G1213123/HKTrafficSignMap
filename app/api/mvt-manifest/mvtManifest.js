import { promises as fs } from 'fs';
import path from 'path';
import { generateSignedUrlGoogle } from '../../lib/generateSignedUrlGoogle.js';

export const MVT_ROOT_DIR = path.join(process.cwd(), 'public', 'data', 'mvt');
export const MVT_MANIFEST_PATH = path.join(MVT_ROOT_DIR, 'manifest.json');
export const MVT_MANIFEST_OBJECT_NAME = 'public/data/mvt/manifest.json';

function getMvtManifestBucketName() {
    return process.env.GCS_BUCKET_NAME || 'road-sign-factory-asset';
}

let manifestCache = null;
let manifestMtimeMs = 0;
let manifestUrlCache = null;

async function readManifestFromFile() {
    const stat = await fs.stat(MVT_MANIFEST_PATH);
    if (manifestCache && manifestUrlCache === 'file' && manifestMtimeMs === stat.mtimeMs) {
        return manifestCache;
    }

    const text = await fs.readFile(MVT_MANIFEST_PATH, 'utf8');
    const manifest = JSON.parse(text);
    manifestCache = manifest;
    manifestMtimeMs = stat.mtimeMs;
    manifestUrlCache = 'file';
    return manifest;
}

async function readManifestFromUrl() {
    const bucketName = getMvtManifestBucketName();
    const cacheKey = `cloud:${bucketName}:${MVT_MANIFEST_OBJECT_NAME}`;
    if (manifestCache && manifestUrlCache === cacheKey) {
        return manifestCache;
    }

    const signedUrl = await generateSignedUrlGoogle({
        bucketName,
        objectName: MVT_MANIFEST_OBJECT_NAME,
    });

    const response = await fetch(signedUrl, { cache: 'no-store' });
    if (!response.ok) {
        return null;
    }

    const manifest = await response.json();
    manifestCache = manifest;
    manifestMtimeMs = Date.now();
    manifestUrlCache = cacheKey;
    return manifest;
}

export async function readMvtManifest() {
    const preferRemote = process.env.NEXT_PUBLIC_DATA_SOURCE === 'cloud' || process.env.NODE_ENV === 'production';

    if (preferRemote) {
        const remoteManifest = await readManifestFromUrl();
        if (remoteManifest) {
            return remoteManifest;
        }
    }

    try {
        return await readManifestFromFile();
    } catch {
        return await readManifestFromUrl();
    }
}

export async function resolveLatestMvtBuildDate() {
    const manifest = await readMvtManifest();
    return manifest?.latestBuildDate || manifest?.latestData?.buildDate || null;
}

export function getMvtBuildRootDir(buildDate) {
    if (!buildDate) return MVT_ROOT_DIR;
    return path.join(MVT_ROOT_DIR, buildDate);
}