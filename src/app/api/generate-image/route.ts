import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Log the prompt to verify it's being received correctly
    console.log("Received image generation prompt:", prompt);

    // Verify API key is present
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API Key");
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "1024x1024",
          model: "dall-e-3" // Specify the model explicitly
        }),
      });

      // Log the full response for debugging
      const responseData = await response.json();
      console.log("OpenAI API Response:", responseData);

      // Check for API-level errors
      if (!response.ok) {
        console.error("OpenAI API Error:", responseData);
        return NextResponse.json({ 
          error: responseData.error?.message || "Failed to generate image via OpenAI" 
        }, { status: 500 });
      }

      const imageUrl = responseData.data[0]?.url;

      if (imageUrl) {
        return NextResponse.json({ imageUrl });
      } else {
        console.error("No image URL in response", responseData);
        return NextResponse.json({ error: "Failed to generate image." }, { status: 500 });
      }
    } catch (apiError) {
      console.error("Fetch Error:", apiError);
      return NextResponse.json({ error: "Error calling OpenAI API" }, { status: 500 });
    }
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}