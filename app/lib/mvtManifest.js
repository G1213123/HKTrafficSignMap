import { promises as fs } from 'fs';
import path from 'path';

export const MVT_ROOT_DIR = path.join(process.cwd(), 'public', 'data', 'mvt');
export const MVT_MANIFEST_PATH = path.join(MVT_ROOT_DIR, 'manifest.json');

let manifestCache = null;
let manifestMtimeMs = 0;

export async function readMvtManifest() {
    try {
        const stat = await fs.stat(MVT_MANIFEST_PATH);
        if (manifestCache && manifestMtimeMs === stat.mtimeMs) {
            return manifestCache;
        }

        const text = await fs.readFile(MVT_MANIFEST_PATH, 'utf8');
        const manifest = JSON.parse(text);
        manifestCache = manifest;
        manifestMtimeMs = stat.mtimeMs;
        return manifest;
    } catch {
        return null;
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