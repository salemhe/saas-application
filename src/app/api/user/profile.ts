import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../../utils/authMiddleware';

const userProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  // Access authenticated user via req.user
  const user = (req as any).user;
  
  // Fetch user-specific data
  return res.status(200).json({ 
    uid: user.uid,
    email: user.email,
    // Other safe user information
  });
};

export default withAuth(userProfile);