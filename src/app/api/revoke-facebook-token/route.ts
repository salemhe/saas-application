// pages/api/revoke-facebook-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the origin from the request headers
  const origin = req.headers.origin;
  
  // Set CORS headers - only allow your ngrok URLs
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
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

    return res.status(200).json({ 
      success: true,
      message: 'Token successfully revoked',
      data: jsonData 
    });

  } catch (error: any) {
    console.error('Error revoking token:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to revoke token'
    });
  }
}