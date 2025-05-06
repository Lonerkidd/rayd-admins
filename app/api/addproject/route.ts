import {connectToDatabase} from "@/database";
import Blog from '@/database/models/blogs';
import { auth } from "@clerk/nextjs";

// Helper function to generate slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
        .substring(0, 100);        // Limit length
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        
        // Get current user from Clerk
        const { userId } = auth();
        
        if (!userId) {
            return new Response(JSON.stringify({ error: 'Not authenticated or missing user ID' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Check if the request is multipart form data or JSON
        const contentType = req.headers.get('content-type') || '';
        let data: Record<string, any> = {};
        let imageBuffer: Buffer | null = null;
        let imageType: string | null = null;
        
        if (contentType.includes('multipart/form-data')) {
            // Handle form data with file upload
            const formData = await req.formData();
            
            // Process regular form fields
            for (const [key, value] of formData.entries()) {
                if (key !== 'image') {
                    data[key] = value;
                }
            }
            
            // Process image file
            const imageFile = formData.get('image') as File | null;
            if (imageFile && imageFile instanceof File) {
                // Convert image file to buffer
                const arrayBuffer = await imageFile.arrayBuffer();
                imageBuffer = Buffer.from(arrayBuffer);
                imageType = imageFile.type;
            }
        } else {
            // Handle JSON data
            data = await req.json();
        }
        
        const { title, content, video, client, excerpt, tags, slug: providedSlug } = data;

        // Generate slug from title if not provided
        const slug = providedSlug || generateSlug(title);
        
        const blogData: any = {
            title,
            content,
            video,
            client,
            slug,
            excerpt,
            tags,
            userId, // Save the Clerk userId with the blog post
        };

        // Add image data if available
        if (imageBuffer && imageType) {
            blogData.image = imageBuffer;
            blogData.imageType = imageType;
        }
        
        const newPost = new Blog(blogData);
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