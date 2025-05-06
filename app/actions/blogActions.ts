'use server'

import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';

export async function getBlogPostAction(id: string) {
  const response = await fetch(`/api/blog/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blog post');
  }
  return response.json();
}

export async function updateBlogPostAction(id: string, updatedData: any) {
  const response = await fetch(`/api/blog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error('Failed to update blog post');
  }
  return response.json();
}