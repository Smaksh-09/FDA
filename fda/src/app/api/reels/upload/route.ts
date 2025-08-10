import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary with your credentials from .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  // This API route is protected by your middleware, so we know a user is logged in.

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // This is the core of the security. We generate a signature on the backend
    // using our secret key. The frontend will use this signature to prove to
    // Cloudinary that the upload request is legitimate.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        // You can add other parameters here to sign, like a folder name
        // folder: 'reels'
      },
      process.env.CLOUDINARY_API_SECRET!    
    );

    // Send the signature and timestamp back to the frontend
    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature.' },
      { status: 500 }
    );
  }
}