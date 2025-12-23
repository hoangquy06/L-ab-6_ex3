import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware runs before every request
export function middleware(request: NextRequest) {
    // Only apply middleware to /api/secret route
    if (request.nextUrl.pathname.startsWith('/api/secret')) {
        // Get the x-api-key header from the request
        const apiKey = request.headers.get('x-api-key');

        // Get the secret key from environment variable
        const secretKey = process.env.API_SECRET_KEY;

        console.log('Middleware Debug:', { 
            receivedApiKey: apiKey, 
            expectedKey: secretKey,
            match: apiKey === secretKey 
        });

        // Check if API key is provided and matches
        if (!apiKey) {
            // No API key provided
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    message: 'Missing x-api-key header',
                    hint: 'Please provide x-api-key header with your request'
                },
                { status: 401 }
            );
        }

        if (apiKey !== secretKey) {
            // API key doesn't match
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    message: 'Invalid API key',
                    hint: 'The provided x-api-key is incorrect'
                },
                { status: 401 }
            );
        }

        // API key is valid, allow the request to continue
        // Add a custom header to indicate successful authentication
        const response = NextResponse.next();
        response.headers.set('x-auth-status', 'authenticated');
        return response;
    }

    // For all other routes, just continue
    return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
    matcher: [
        // Apply to API routes
        '/api/:path*',
    ],
};
