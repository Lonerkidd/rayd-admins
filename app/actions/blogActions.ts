'use server'

import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';
import { BlogFormValues } from '@/types';

// Function to fetch a blog post by ID
export async function getBlogPostAction(id: string) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch the blog post by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error('Blog post not found');
    }

    // Return the blog post data
    return {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      image: blog.image ? 'exists' : null, // Just indicate image exists, will be fetched via API
      category: blog.category || '',
      client: blog.client || '',
      video: blog.videoUrl || '',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw new Error('Failed to fetch blog post');
  }
}

// Function to update a blog post
export async function updateBlogPostAction(id: string, updatedData: BlogFormValues) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Prepare update data - exclude the image if it's a string or null
    // (we'll handle image updates differently via API route)
    const updateData: any = {
      title: updatedData.title,
      content: updatedData.content,
      category: updatedData.category || '',
      client: updatedData.client || '',
      video: updatedData.video || '',
      updatedAt: new Date()
    };

    // Update the blog post in the database
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      throw new Error('Blog post not found or failed to update');
    }

    // Return the updated blog post
    return {
      id: updatedBlog._id.toString(),
      title: updatedBlog.title,
      content: updatedBlog.content,
      category: updatedBlog.category || '',
      image: updatedBlog.image ? 'exists' : null,
      client: updatedBlog.client || '',
      video: updatedBlog.videoUrl || '',
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
}