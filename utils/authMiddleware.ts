import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import admin from "../firebaseAdmin"; // Firebase Admin SDK

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const sessionToken = req.cookies.session;

    // Check if sessionToken exists
    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'No session token found'
      });
    }

    try {
      // Verify session token
      const decodedToken = await admin.auth().verifySessionCookie(sessionToken, true);

      // If the token is valid, we can also check if it has been revoked or is otherwise invalid.
      // Firebase will throw an error if the token is revoked or outdated.
      if (!decodedToken.uid) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid or revoked'
        });
      }

      // Create a type-safe way to attach user to the request
      interface AuthenticatedNextApiRequest extends NextApiRequest {
        user?: admin.auth.DecodedIdToken;
      }

      const authenticatedReq = req as AuthenticatedNextApiRequest;
      authenticatedReq.user = decodedToken;

      return handler(authenticatedReq, res);
    } catch (error: any) {
      console.error('Session verification error:', error);

      // Handling specific Firebase error codes if token is expired or revoked
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.'
        });
      } else if (error.code === 'auth/id-token-revoked') {
        return res.status(401).json({
          success: false,
          message: 'Token has been revoked. Please log in again.'
        });
      }

      // General error handling for other issues
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  };
}
