// app/api/revoke-facebook-token/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Helper function to handle CORS
async function corsResponse(response: NextResponse) {
  // Get the request headers
  const headersList = headers();
  const origin = (await headersList).get('origin');

  // Only set CORS headers if origin exists
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return corsResponse(
    new NextResponse(null, {
      status: 200,
    })
  );
}

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return corsResponse(
        NextResponse.json(
          { message: 'Access token is required' },
          { status: 400 }
        )
      );
    }

    const graphApiUrl = `https://graph.facebook.com/v18.0/me/permissions`;
    const response = await fetch(`${graphApiUrl}?access_token=${accessToken}`, {
      method: 'DELETE',
    });

    const responseData = await response.text();
    const jsonData = responseData ? JSON.parse(responseData) : {};

    if (!response.ok) {
      throw new Error(jsonData.error?.message || `Failed to revoke token: ${response.status}`);
    }

    return corsResponse(
      NextResponse.json({ 
        success: true,
        message: 'Token successfully revoked',
        data: jsonData 
      })
    );

  } catch (error: any) {
    console.error('Error revoking token:', error);
    return corsResponse(
      NextResponse.json({ 
        success: false,
        message: error.message || 'Failed to revoke token'
      }, { 
        status: 500 
      })
    );
  }
}