import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { prompt } = await request.json();

    // Validate prompt
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Prepare payload for Stability AI
    const payload = {
      prompt: prompt,
      output_format: "webp",
      // Optional: Add more parameters as needed
      style: "cinematic", // You can adjust this
      aspect_ratio: "1:1"
    };

    // Make request to Stability AI
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`, 
          Accept: "image/*" 
        },
      }
    );

    // Check response status
    if (response.status === 200) {
      // Convert image to base64
      const base64Image = Buffer.from(response.data).toString('base64');
      const dataUri = `data:image/webp;base64,${base64Image}`;

      return NextResponse.json({ 
        imageUrl: dataUri 
      });
    } else {
      // Log the error details
      console.error('Stability AI Error:', response.status, response.data.toString());
      
      return NextResponse.json({ 
        error: 'Image generation failed', 
        details: response.data.toString() 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}