import {connectToDatabase} from "@/database";
import  Blog  from '@/database/models/blogs';

//Route to get all posts

export async function GET() {
    try {
        await connectToDatabase();

        const response = await Blog.find({});

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch posts', reason:error }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
