import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogForm } from '@/components/blog/BlogForm';
import { connectToDatabase } from '@/database';
import Blog from '@/database/models/blogs';

export const metadata: Metadata = {
  title: 'Edit Blog Post',
  description: 'Edit an existing blog post',
};

// This function generates the static params at build time
export async function generateStaticParams() {
  // Connect to database - in production, you might want to limit this
  await connectToDatabase();
  const blogs = await Blog.find({}).limit(20);
  
  return blogs.map((blog) => ({
    id: blog._id.toString(),
  }));
}

// Get the blog post data from the database
async function getBlogPost(id: string) {
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


export default async function EditBlogPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Make sure to await the params object
  const id = params?.id;
  
  // Validate that id exists and is a string
  if (!id || typeof id !== 'string') {
    notFound();
  }
  
  const blog = await getBlogPost(id);
  
  // If blog post not found, show 404
  if (!blog) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogForm mode="edit" defaultValues={{ ...blog, tags: blog.tags.join(', ') }} />
    </div>
  );
}