'use client';

import { useParams, useRouter } from 'next/navigation';
import { BlogForm } from '@/components/blog/BlogForm';
import { useEffect, useState } from 'react';
import { getBlogPostAction, updateBlogPostAction } from '@/app/actions/blogActions';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';


export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [blog, setBlog] = useState<{
    id: string;
    title: string;
    content: string;
    image: string | null;
    slug: string;
    client: string;
    category: string;
    video: string;
    excerpt: string;
    tags: string[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlog() {
      if (!id || typeof id !== 'string') {
        setError('Invalid blog post ID');
        setLoading(false);
        return;
      }

      try {
        const blogData = await getBlogPostAction(id);
        if (blogData) {
          setBlog({
            id: blogData.id,
            title: blogData.title,
            content: blogData.content,
            image: blogData.image || null,
            slug: blogData.slug,
            client: blogData.client,
            category: blogData.category,
            video: blogData.video,
            excerpt: blogData.excerpt,
            tags: blogData.tags,
          });
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error loading blog:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [id]);

  const handleUpdate = async (updatedData: any) => {
    try {
      setLoading(true);
      await updateBlogPostAction(id, updatedData);
      router.push('/portfolio-list'); // Redirect to the portfolio list after successful update
    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

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

    return <BlogForm mode="edit" defaultValues={{ ...blog, tags: blog.tags.join(', ') }} onSubmit={handleUpdate} />;
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <div>
          <div className="flex items-center justify-between mt-6 ml-4 gap-2 mb-3">
            <h1 className="text-3xl font-heading font-medium text-white">Edit Portfolio Item</h1>
          </div>
          {renderContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}