'use server'

import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';

export async function getBlogPostAction(id: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(id);
    if (!blog) return null;
    
    return {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      image: blog.image,
      slug: blog.slug,
      client: blog.client || '',
      video: blog.video || '',
      excerpt: blog.excerpt || '',
      tags: blog.tags || [],
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}