import { connectToDatabase } from "@/database";
import Blog from '@/database/models/blogs';
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for blog updates
const updateBlogSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }).optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }).optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  video: z.string().optional(),
  keepExistingImage: z.string().optional(),
});

// Route to update a post
export async function PUT(req: Request) {
    try {
        // Connect to database
        await connectToDatabase();

        // Get post ID from URL
        const url = new URL(req.url);
        const postId = url.pathname.split("/").pop();

        // Check if request is multipart (has file) or JSON
        const contentType = req.headers.get('content-type') || '';
        let data: Record<string, any> = {};
        let imageBuffer: Buffer | null = null;
        let imageType: string | null = null;
        let keepExistingImage = false;

        if (contentType.includes('multipart/form-data')) {
            // Handle form data with possible file upload
            const formData = await req.formData();
            
            // Process regular form fields
            for (const [key, value] of formData.entries()) {
                if (key !== 'image') {
                    if (key === 'keepExistingImage' && value === 'true') {
                        keepExistingImage = true;
                    } else {
                        data[key] = value;
                    }
                }
            }
            
            // Process image file if present
            const imageFile = formData.get('image') as File | null;
            if (imageFile && imageFile instanceof File) {
                const arrayBuffer = await imageFile.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
                imageType = imageFile.type;
            }
        } else {
            // Handle JSON data
            data = await req.json();
            
            // Check if we should keep existing image
            if (data.keepExistingImage === 'true') {
                keepExistingImage = true;
                delete data.keepExistingImage;
            }
        }
        
        // Validate input data
        const validationResult = updateBlogSchema.safeParse(data);
        if (!validationResult.success) {
          return NextResponse.json(
            { error: 'Validation error', details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        // Get validated data
        const validatedData = validationResult.data;

        // Check if the blog exists
        const existingBlog = await Blog.findById(postId);
        if (!existingBlog) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }

        // Prepare update object
        const updateObject: any = {
            ...validatedData,
            updatedAt: new Date()
        };

        // Handle image update if there's a new image
        if (imageBuffer && imageType) {
            updateObject.image = imageBuffer;
            updateObject.imageType = imageType;
        } else if (!keepExistingImage && !imageBuffer) {
            // If not keeping existing image and no new image provided, remove the image
            updateObject.image = undefined;
            updateObject.imageType = undefined;
        }
        // If keepExistingImage is true, don't modify the image fields

        // Update the blog post in the database
        const updatedPost = await Blog.findByIdAndUpdate(
            postId,
            { $set: updateObject },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            { message: "Post updated successfully", post: updatedPost },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { message: "Failed to update post" },
            { status: 500 }
        );
    }
}