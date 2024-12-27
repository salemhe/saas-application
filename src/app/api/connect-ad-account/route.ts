import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { token, adAccountId } = await req.json();

    // Example: Fetch ad account details from Facebook
    const response = await axios.get(
      `https://graph.facebook.com/v15.0/${adAccountId}`,
      {
        params: { access_token: token },
      }
    );
    console.log(response.data);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error connecting to ad account' }, { status: 500 });
  }
}

