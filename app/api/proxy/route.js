import { NextResponse } from 'next/server';
import { generateSignedUrlGoogle, toBucketObjectName } from '../../lib/generateSignedUrlGoogle';

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
      try {
        const signedUrl = await generateSignedUrlGoogle({
          bucketName: resolvedUrl.bucketName,
          objectName: resolvedUrl.objectName,
          expiresMs: resolvedUrl.expiresMs,
        });

        response = await fetch(signedUrl);
      } catch (signErr) {
        console.error('Failed to generate or fetch signed URL:', signErr);
        return new NextResponse('Internal Server Error (signing failed)', { status: 500 });
      }
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
    
    return new NextResponse(response.body, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
