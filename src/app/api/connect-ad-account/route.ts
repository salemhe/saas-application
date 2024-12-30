// app/api/connect-ad-account/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const { token, adAccountId, userId } = await request.json()

    // Validate required fields
    if (!token || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const facebookUrl = `https://graph.facebook.com/v18.0/${adAccountId}/insights?access_token=${token}`

    // Your logic to handle the Facebook ad account connection
    const response = await fetch(facebookUrl)
    const data = await response.json()

    // Return success response
    return NextResponse.json({
      data,
      success: true,
      message: 'Ad account connected successfully'
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}