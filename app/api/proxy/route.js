import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Validate URL to prevent open proxy abuse
  const allowedPrefix = 'https://storage.googleapis.com/road-sign-factory-static/public/data/svgs';
  if (!url.startsWith(allowedPrefix)) {
    return new NextResponse('Forbidden URL', { status: 403 });
  }

  try {
    const response = await fetch(url);
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
