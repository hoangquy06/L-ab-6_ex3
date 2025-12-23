import { NextResponse } from 'next/server';

// API Route: GET /api/secret
// This endpoint is protected by middleware
export async function GET() {
    // If this code runs, it means the middleware has validated the API key
    return NextResponse.json({
        secret: 'Next.js is cool',
        message: '🎄 Chúc mừng! Bạn đã truy cập thành công API bí mật!',
        timestamp: new Date().toISOString(),
        author: 'Võ Hoàng Quý',
    });
}

// Also support POST method for demonstration
export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));

    return NextResponse.json({
        secret: 'Next.js is cool',
        message: '🎄 POST request thành công!',
        receivedData: body,
        timestamp: new Date().toISOString(),
    });
}
