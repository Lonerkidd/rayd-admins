import { connectToDatabase } from "@/database";
import Blog from '@/database/models/blogs';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


interface IBlog {
    title: string;
    content: string;
    image: string;
    slug: string;
    excerpt: string;
    video?: string;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    author?: string;
  }
  

// Create handler for deleting the posts
export async function DELETE(request: Request) {
    try{
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
        const url = new URL(request.url);
        const postId = url.pathname.split("/").pop();

        // Check if the blog exists before attempting to delete
        const existingBlog = await Blog.findById(postId).lean() as IBlog;
        if (!existingBlog) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            );
        }
        
        // Optional: Check if user is the author or has admin privileges
        if (existingBlog.author?.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Not authorized to delete this post" },
                { status: 403 }
            );
        }

        // Delete post by ID
        const deletedPost = await Blog.findByIdAndDelete(postId);

        return NextResponse.json(
            { message: "Post deleted successfully", post: deletedPost },
            { status: 200 }
        );

    }catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { message: "Failed to delete post" },
            { status: 500 }
        );
    }
}
