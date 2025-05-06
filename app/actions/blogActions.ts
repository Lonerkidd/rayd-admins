'use server'

import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';

export async function getBlogPostAction(id: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(id);
    if (!blog) return null;
    
    // If blog has a Buffer image, convert it to a base64 string
    if (blog && blog.image && blog.image instanceof Buffer) {
      return {
        id: blog._id.toString(),
        title: blog.title,
        content: blog.content,
        image: blog.image.toString('base64'),
        client: blog.client || '',
        category: blog.category || '', 
        video: blog.video || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '', 
      };
    }
    
    return {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      image: blog.image,
      client: blog.client || '',
      video: blog.video || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}