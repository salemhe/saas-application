import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../firebase'; // Your Firebase config
import admin from '../../../../firebaseAdmin'; // Firebase Admin SDK
import { signInWithEmailAndPassword } from 'firebase/auth';

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
     return res.status(405).json({ message: 'Method not allowed' });
   }
 
   try {
     const { email, password } = req.body;
 
     // Authenticate user via Firebase Authentication
     const userCredential = await signInWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;
 
     // Ensure user.uid exists
     if (!user.uid) {
       return res.status(401).json({
         success: false,
         message: 'User ID not found',
       });
     }
 
     // Generate secure session token
     const idToken = await user.getIdToken();
     const sessionToken = await admin.auth().createSessionCookie(idToken, {
       expiresIn: 24 * 60 * 60 * 1000, // 24 hours
     });
 
     // Store refresh token as an HTTP-only cookie
     const refreshToken = user.refreshToken;
     res.setHeader('Set-Cookie', [
       `session=${sessionToken}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${24 * 60 * 60}`, // 24 hours
       `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${7 * 24 * 60 * 60}`, // 7 days
     ]);
 
     return res.status(200).json({
       success: true,
       message: 'Logged in successfully',
       uid: user.uid,
     });
   } catch (error) {
     console.error('Login error:', error);
     return res.status(401).json({
       success: false,
       message: 'Authentication failed',
     });
   }
 }


