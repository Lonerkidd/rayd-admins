'use client'

import { useParams } from 'next/navigation';
import { BlogForm } from '@/components/blog/BlogForm';
import { useEffect, useState } from 'react';
import { getBlogPostAction } from '@/app/actions/blogActions';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import BreadcrumbBar from "@/components/breadcrumber";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<{
    id: string;
    title: string;
    content: string;
    image: string | null; // Make image optional
    slug: string;
    client: string;
    category: string;
    video: string;
    excerpt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadBlog() {
      if (!id || typeof id !== 'string') {
        setError("Invalid blog post ID");
        setLoading(false);
        return;
      }
      
      try {
        const blogData = await getBlogPostAction(id);
        if (blogData) {
          // Set image value to the ID - will be used to construct API URL
          setBlog({
            ...blogData,
            image: blogData.image ? blogData.id : null,
            category: blogData.category || '', // Ensure category is included
          });
        } else {
          setError("Blog post not found");
        }
      } catch (error) {
        console.error('Error loading blog:', error);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    }
    
    loadBlog();
  }, [id]);
  
  // Render content based on current state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F9B99]"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <div className="flex">
            <div>
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-red-500 mt-2">Please try again or contact support.</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (!blog) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <div className="flex">
            <div>
              <p className="text-yellow-700 font-medium">Blog post not found</p>
              <p className="text-yellow-500 mt-2">The requested blog post could not be found.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return <BlogForm mode="edit" defaultValues={{ ...blog }} />;
  };
  
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="max-w-7xl mx-auto p-6">
          <BreadcrumbBar />
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-heading font-bold text-white">Edit Portfolio Item</h1>
          </div>
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}