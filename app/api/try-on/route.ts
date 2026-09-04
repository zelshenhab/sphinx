import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FASHN_API = 'https://api.fashn.ai/v1';
const requestLog = new Map<string, number[]>();

function apiKey() {
  return process.env.FASHN_API_KEY;
}

function limited(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 3) return true;
  requestLog.set(ip, [...recent, now]);
  return false;
}

function response(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function POST(request: NextRequest) {
  const key = apiKey();
  if (!key) return response({ error: 'Try-on service is not configured yet.' }, 503);
  if (limited(request))
    return response({ error: 'Too many try-on requests. Please try later.' }, 429);

  try {
    const body = (await request.json()) as { modelImage?: string; garmentImage?: string };
    if (!body.modelImage?.startsWith('data:image/') || body.modelImage.length > 3_000_000) {
      return response({ error: 'Please upload a valid image smaller than 2 MB.' }, 400);
    }
    if (!body.garmentImage || !/^https?:\/\//.test(body.garmentImage)) {
      return response({ error: 'Invalid garment image.' }, 400);
    }

    const upstream = await fetch(`${FASHN_API}/run`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_name: 'tryon-v1.6',
        inputs: {
          model_image: body.modelImage,
          garment_image: body.garmentImage,
          category: 'tops',
          garment_photo_type: 'auto',
          mode: 'balanced',
          moderation_level: 'conservative',
          output_format: 'jpeg',
          return_base64: true,
          num_samples: 1,
        },
      }),
      cache: 'no-store',
    });
    const data = await upstream.json();
    if (!upstream.ok)
      return response({ error: data.message || data.error || 'Try-on failed.' }, upstream.status);
    return response({ id: data.id });
  } catch (error) {
    console.error('[SPHINX_TRY_ON_START_ERROR]', error);
    return response({ error: 'Could not start virtual try-on.' }, 500);
  }
}

export async function GET(request: NextRequest) {
  const key = apiKey();
  if (!key) return response({ error: 'Try-on service is not configured yet.' }, 503);
  const id = request.nextUrl.searchParams.get('id') ?? '';
  if (!/^[a-zA-Z0-9-]{10,100}$/.test(id)) return response({ error: 'Invalid request id.' }, 400);

  try {
    const upstream = await fetch(`${FASHN_API}/status/${id}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    const data = await upstream.json();
    if (!upstream.ok)
      return response(
        { error: data.message || data.error || 'Could not check result.' },
        upstream.status,
      );
    return response({ status: data.status, output: data.output, error: data.error });
  } catch (error) {
    console.error('[SPHINX_TRY_ON_STATUS_ERROR]', error);
    return response({ error: 'Could not check virtual try-on.' }, 500);
  }
}
