import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Use a secure key in your .env file

// Generate JWT Token
export const generateToken = (payload: object, expiresIn: string = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Invalid or expired token', error);
  }
};
