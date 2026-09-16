import { NextResponse } from 'next/server';
import { generateSignedUrlGoogle, toBucketObjectName } from '../../lib/generateSignedUrlGoogle';

const assetResponseCache = globalThis.__assetResponseCache || new Map();
const assetFetches = globalThis.__assetFetches || new Map();
globalThis.__assetResponseCache = assetResponseCache;
globalThis.__assetFetches = assetFetches;
const ASSET_CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_ASSET_CACHE_ENTRIES = 256;

function getDataSource() {
  return process.env.NODE_ENV === 'development' ? 'local' : 'cloud';
}

function getAllowedPrefixes() {
  return ['/data/svgs'];
}

function resolveAssetUrl(assetPath) {
  if (!assetPath) return null;

  if (!assetPath.startsWith('/data/svgs/')) {
    return null;
  }

  if (getDataSource() === 'local') {
    return assetPath;
  }
  // Cloud: generate a V4 signed URL using the Storage client
  const bucketName = process.env.GCS_BUCKET_NAME || 'road-sign-factory-asset';
  const objectName = toBucketObjectName(assetPath);

  const expiresMs = 15 * 60 * 1000; // 15 minutes
  // Return a promise-like placeholder; callers will await when needed
  return { __signedUrlRequest: true, bucketName, objectName, expiresMs };
}

function cacheAssetResponse(cacheKey, asset) {
  if (assetResponseCache.size >= MAX_ASSET_CACHE_ENTRIES) {
    assetResponseCache.delete(assetResponseCache.keys().next().value);
  }

  assetResponseCache.set(cacheKey, {
    body: asset.body,
    contentType: asset.contentType,
    expiresAt: Date.now() + ASSET_CACHE_TTL_MS,
  });
}

function buildAssetHeaders(contentType) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  });
  if (contentType) headers.set('content-type', contentType);
  return headers;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const assetPath = searchParams.get('asset');
  const url = searchParams.get('url');
  const resolvedUrl = assetPath ? resolveAssetUrl(assetPath) : url;

  if (!resolvedUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const allowedPrefixes = getAllowedPrefixes();
  // If resolvedUrl is a signed-url request object, it's allowed. Otherwise require allowed prefix.
  if (!(resolvedUrl && resolvedUrl.__signedUrlRequest) && !allowedPrefixes.some(prefix => typeof resolvedUrl === 'string' && resolvedUrl.startsWith(prefix))) {
    return new NextResponse('Forbidden URL', { status: 403 });
  }

  try {
    let response;
    
    // Handle local file paths
    if (typeof resolvedUrl === 'string' && resolvedUrl.startsWith('/data/svgs')) {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      const localPath = path.join(process.cwd(), 'public', resolvedUrl);
      try {
        const fileData = await fs.readFile(localPath);
        const headers = new Headers();
        
        // Determine content-type based on file extension
        if (resolvedUrl.endsWith('.svg')) {
          headers.set('content-type', 'image/svg+xml');
        } else if (resolvedUrl.endsWith('.png')) {
          headers.set('content-type', 'image/png');
        } else if (resolvedUrl.endsWith('.jpg') || resolvedUrl.endsWith('.jpeg')) {
          headers.set('content-type', 'image/jpeg');
        }
        
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        
        return new NextResponse(fileData, {
          status: 200,
          headers: headers,
        });
      } catch (err) {
        console.error('Local file error:', err);
        return new NextResponse('File not found', { status: 404 });
      }
    }
    
    // Handle remote URLs (Google Cloud Storage)
    if (resolvedUrl && resolvedUrl.__signedUrlRequest) {
      const cacheKey = `${resolvedUrl.bucketName}:${resolvedUrl.objectName}`;
      const cached = assetResponseCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return new NextResponse(cached.body.slice(), {
          status: 200,
          headers: buildAssetHeaders(cached.contentType),
        });
      }

      let assetFetch = assetFetches.get(cacheKey);
      if (!assetFetch) {
        assetFetch = (async () => {
          const signedUrl = await generateSignedUrlGoogle({
            bucketName: resolvedUrl.bucketName,
            objectName: resolvedUrl.objectName,
            expiresMs: resolvedUrl.expiresMs,
          });

          const remoteResponse = await fetch(signedUrl);
          if (!remoteResponse.ok) {
            return {
              status: remoteResponse.status,
              statusText: remoteResponse.statusText,
              body: null,
              contentType: null,
            };
          }

          return {
            status: remoteResponse.status,
            statusText: remoteResponse.statusText,
            body: new Uint8Array(await remoteResponse.arrayBuffer()),
            contentType: remoteResponse.headers.get('content-type'),
          };
        })();
        assetFetches.set(cacheKey, assetFetch);
        try {
          response = await assetFetch;
        } finally {
          assetFetches.delete(cacheKey);
        }
      } else {
        response = await assetFetch;
      }

      if (response.body) {
        cacheAssetResponse(cacheKey, response);
        return new NextResponse(response.body.slice(), {
          status: response.status,
          headers: buildAssetHeaders(response.contentType),
        });
      }

      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    } else {
      response = await fetch(resolvedUrl);
    }
    if (!response.ok) {
        return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
    }
    
    const headers = new Headers();
    // Copy content-type
    if (response.headers.has('content-type')) {
        headers.set('content-type', response.headers.get('content-type'));
    }
    
    // Ensure CORS headers allow usage on canvas
    headers.set('Access-Control-Allow-Origin', '*'); 
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    
    return new NextResponse(response.body, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
