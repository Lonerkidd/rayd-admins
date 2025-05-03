import {connectToDatabase} from "@/database";
import Blog from '@/database/models/blogs';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        
        // Get current user from session
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ error: 'Not authenticated or missing user ID' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Handle form data or JSON
        let data: Record<string, any> = {};
        const contentType = req.headers.get('content-type') || '';
        
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            
            // Convert FormData to object with proper type checking
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Parse tags from JSON string if present
            if (data.tags && typeof data.tags === 'string') {
                try {
                    data.tags = JSON.parse(data.tags);
                } catch {
                    // If parsing fails, split by comma as fallback
                    data.tags = (data.tags as string).split(',').map((tag: string) => tag.trim());
                }
            }
        } else {
            data = await req.json();
        }
        
        const { title, content, image, video, slug, excerpt, tags } = data;

        // Create a valid ObjectId from the session user id
        //const authorId = new mongoose.Types.ObjectId(session.user.id);
        
        const newPost = new Blog({
            title,
            content,
            image,
            video,
            slug,
            excerpt,
            tags,
            //author: authorId,
        });

        const savedPost = await newPost.save();

        return new Response(JSON.stringify(savedPost), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return new Response(JSON.stringify({ error: 'Failed to create post', reason: error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}