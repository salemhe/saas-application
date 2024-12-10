import { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../firebaseAdmin";

export async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
   const sessionToken: any = req.cookies.session;
 
   try {
     const decodedToken = await admin.auth().verifySessionCookie(sessionToken);
     await admin.auth().revokeRefreshTokens(decodedToken.uid);
 
     res.setHeader('Set-Cookie', [
       'session=; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=0',
       'refreshToken=; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=0',
     ]);
 
     return res.status(200).json({ success: true, message: 'Logged out successfully' });
   } catch (error) {
     console.error('Logout error:', error);
     return res.status(500).json({ success: false, message: 'Logout failed' });
   }
 }
 