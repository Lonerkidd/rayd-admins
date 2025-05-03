import { connectToDatabase } from "@/database";
import Blog from "@/database/models/blogs";
import sharp from "sharp"; // You'll need to install this: npm install sharp

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const id = params.id;
    const blogPost = await Blog.findById(id).select("image imageType");

    if (!blogPost || !blogPost.image) {
      return new Response("Image not found", { status: 404 });
    }

    // Resize the image using sharp (install with: npm install sharp)
    const resizedImageBuffer = await sharp(blogPost.image)
      .resize(300, 200, { fit: 'cover' })
      .toBuffer();

    return new Response(resizedImageBuffer, {
      status: 200,
      headers: {
        "Content-Type": blogPost.imageType || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error creating thumbnail:", error);
    return new Response("Error creating thumbnail", { status: 500 });
  }
}
