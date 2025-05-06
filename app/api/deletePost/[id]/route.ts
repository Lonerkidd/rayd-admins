import { connectToDatabase } from "@/database";
import Blog from '@/database/models/blogs';
import { NextResponse } from "next/server";


// 
  

// Create handler for deleting the posts
export async function DELETE(request: Request) {
    try{
        // Connect to database
        await connectToDatabase();

        // Get post ID from URL
        const url = new URL(request.url);
        const postId = url.pathname.split("/").pop();

        // Check if the blog exists before attempting to delete
        const existingBlog = await Blog.findById(postId).lean();
        
        
        // If blog post not found, return 404
        if (!existingBlog) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
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
