import { Metadata } from 'next';
import { BlogForm } from '@/components/blog/BlogForm';

export const metadata: Metadata = {
  title: 'Create Blog Post',
  description: 'Create a new blog post',
};

export default function CreateBlogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Portfolio Item</h1>
      <BlogForm mode="create" />
    </div>
  );
}