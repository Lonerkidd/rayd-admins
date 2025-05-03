import { connectToDatabase } from "@/database";
import Blog from '@/database/models/blogs';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Validation schema for blog updates
const updateBlogSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }).optional(),
  content: z.string().min(10, { message: "Content must be at least 10 characters long" }).optional(),
  image: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  video: z.string().optional(),
});

// Route to update a post
export async function PUT(req: Request) {
    try {
        // Verify authentication
        const session = await getServerSession(authOptions);
        
        // Check authentication
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }

        // Connect to database
        await connectToDatabase();

        // Get post ID from URL
        const url = new URL(req.url);
        const postId = url.pathname.split("/").pop();

        // Parse request body
        const body = await req.json();
        
        // Validate input data
        const validationResult = updateBlogSchema.safeParse(body);
        if (!validationResult.success) {
          return NextResponse.json(
            { error: 'Validation error', details: validationResult.error.format() },
            { status: 400 }
          );
        }
        
        const data = validationResult.data;

        // Check if the blog exists and user is authorized to update it
        const existingBlog = await Blog.findById(postId);
        if (!existingBlog) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }
        
        // Optional: Check if user is the author or has admin privileges
        if (existingBlog.author.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Not authorized to update this post" },
                { status: 403 }
            );
        }

        // Update the blog post in the database
        const updatedPost = await Blog.findByIdAndUpdate(
            postId,
            { 
                $set: data,
                updatedAt: new Date()
            },
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