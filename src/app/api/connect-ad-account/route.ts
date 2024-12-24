import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, adAccountId } = req.body;

    // Example: Fetch ad account details from Facebook
    const response = await axios.get(
      `https://graph.facebook.com/v15.0/${adAccountId}`,
      {
        params: { access_token: token },
      }
    );
    console.log(response.data);

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error connecting to ad account' });
  }
}
