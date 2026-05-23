import { NextResponse } from 'next/server';
import { readMvtManifest } from './mvtManifest.js';

export async function GET() {
    const manifest = await readMvtManifest();

    if (!manifest) {
        return NextResponse.json({ error: 'MVT manifest not found' }, { status: 404 });
    }

    return NextResponse.json(manifest, {
        status: 200,
        headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
    });
}