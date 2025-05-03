'use client'

import { useParams } from 'next/navigation';
import { BlogForm } from '@/components/blog/BlogForm';
import { useEffect, useState } from 'react';
import { getBlogPostAction } from '@/app/actions/blogActions';

// Move getBlogPost to a separate server action file
// You'll need to import that action here

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<{
    id: string;
    title: string;
    content: string;
    image: string;
    slug: string;
    client: string;
    video: string;
    excerpt: string;
    tags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadBlog() {
      if (!id || typeof id !== 'string') {
        // Handle invalid ID
        return;
      }
      
      try {
        // Replace with your server action or API call
        const blogData = await getBlogPostAction(id);
        if (blogData) {
          setBlog(blogData);
        } else {
          // Handle not found
        }
      } catch (error) {
        console.error('Error loading blog:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadBlog();
  }, [id]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!blog) {
    return <div>Blog post not found</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogForm mode="edit" defaultValues={{ ...blog, tags: blog.tags.join(', ') }} />
    </div>
  );
}