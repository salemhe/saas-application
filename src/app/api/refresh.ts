import type { NextApiRequest, NextApiResponse } from 'next';
import admin from '../../../firebaseAdmin'; // Firebase Admin SDK

export default async function refreshHandler(req: NextApiRequest, res: NextApiResponse) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is missing or expired',
    });
  }

  try {
    // Verify the refresh token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(refreshToken, true);
    
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Use the user's UID from the decoded refresh token to create a new session cookie (ID token-based)
    const newIdToken = await admin.auth().createSessionCookie(
      decodedToken.uid,  // Use UID from refresh token
      { expiresIn: 24 * 60 * 60 * 1000 } // 24 hours validity for the new session cookie
    );

    // Set the new session cookie
    res.setHeader('Set-Cookie', [
      `session=${newIdToken}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${24 * 60 * 60}`,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Session refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing session:', error);
    return res.status(401).json({
      success: false,
      message: 'Failed to refresh session',
    });
  }
}
