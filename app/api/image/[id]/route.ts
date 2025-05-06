import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    const blogPost = await Blog.findById(id).select("image imageType");
    if (!blogPost) {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, image: blogPost.image, imageType: blogPost.imageType }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
