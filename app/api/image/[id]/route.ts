import { connectToDatabase } from "@/database";
import Blog from "@/database/models/blogs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const {id} = params;

    // Find the blog post by ID
    const blogPost = await Blog.findById(id).select("image imageType");

    // Check if the post exists and has an image
    if (!blogPost || !blogPost.image) {
      return new Response("Image not found", { status: 404 });
    }

    // Return the image with proper content type
    return new Response(blogPost.image, {
      status: 200,
      headers: {
        "Content-Type": blogPost.imageType || "image/jpeg", // Default to JPEG if no type specified
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new Response("Error fetching image", { status: 500 });
  }
}
