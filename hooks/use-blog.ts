import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BlogFormValues } from '@/types';
import { useSession } from 'next-auth/react'; // Assuming you're using NextAuth for user sessions

const defaultFormValues: BlogFormValues = {  
  title: '',
  content: '',
  slug: '',
  excerpt: '',
  tags: '',
  image: null,
  video: '',
};

export default function useBlogForm(
  initialValues: Partial<BlogFormValues> = {},
  mode: 'create' | 'edit' = 'create'
) {
  const [formValues, setFormValues] = useState<BlogFormValues>({
    ...defaultFormValues,
    ...initialValues,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialValues.image === 'string' ? initialValues.image : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormValues((prev) => ({ ...prev, image: file }));

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare form data for submission
      const formData = new FormData();
      
      // Add all text fields
      formData.append('title', formValues.title);
      formData.append('content', formValues.content);
      if (formValues.slug) formData.append('slug', formValues.slug);
      if (formValues.excerpt) formData.append('excerpt', formValues.excerpt);
      if (formValues.video) formData.append('video', formValues.video);

      // Add author ID from session
      if (session?.user && 'id' in session.user) {
        formData.append('author', String(session.user.id));
      } else {
        throw new Error("You must be logged in to create a blog post");
      }
      
      // Add tags - convert comma-separated string to array
      if (formValues.tags) {
        const tagsArray = formValues.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);
        formData.append('tags', JSON.stringify(tagsArray));
      }

      // Add image if available
      if (formValues.image instanceof File) {
        formData.append('image', formValues.image);
      } else if (typeof formValues.image === 'string' && formValues.image) {
        formData.append('image', formValues.image);
      }

      // Submit to API
      const endpoint = mode === 'create' ? '/api/addPost' : `/api/updatePost/${initialValues.id}`;
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save blog post');
      }

      // Redirect after successful operation
      router.push('/blogs');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    formValues,
    isSubmitting,
    error,
    imagePreview,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleFileSelect,
    handleSubmit,
    handleCancel,
  };
}
