// pages/api/connect-ad-account.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, adAccountId, userId } = req.body;
    const facebookUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights?access_token=${token}`;
    // Validate required fields
    if (!token || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Your logic to handle the Facebook ad account connection
    // ...
    const response = await fetch(facebookUrl);
    const data = await response.json();

    // Return success response
    return res.status(200).json({ 
      data,
      success: true,
      message: 'Ad account connected successfully'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error.message || 'Internal server error'
    });
  }
}