import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogFormValues } from '@/types';

const defaultFormValues: BlogFormValues = {  
  title: '',
  content: '',
  category: '',
  client: '',
  image: null,
  video: '',
};

export default function useBlogForm(
  defaultValues: Partial<BlogFormValues> = {},
  mode: 'create' | 'edit' = 'create'
) {
  const [formValues, setFormValues] = useState<BlogFormValues>({
    ...defaultFormValues,
    ...defaultValues,
  });
  
  // Initialize image preview based on mode and defaultValues
  const [imagePreview, setImagePreview] = useState<string | null>(
    mode === 'edit' && defaultValues.id 
      ? `/api/image/${defaultValues.id}?timestamp=${Date.now()}` 
      : null
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      // Initialize with default values while preserving current form state
      setFormValues(prev => ({ 
        ...prev, 
        ...defaultValues,
      }));
    }
  }, [defaultValues]);

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
      // Validate required fields
      if (!formValues.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formValues.content.trim()) {
        throw new Error('Content is required');
      }

      // Prepare form data for submission
      const formData = new FormData();
      
      // Add all text fields
      formData.append('title', formValues.title);
      formData.append('content', formValues.content);
      formData.append('category', formValues.category || ''); 
      formData.append('client', formValues.client || ''); 
      if (formValues.video) formData.append('video', formValues.video);

      // Add image if available and it's a File object (new upload)
      if (formValues.image instanceof File) {
        formData.append('image', formValues.image);
      } else if (mode === 'edit' && imagePreview && imagePreview.includes(`/api/image/${defaultValues.id}`)) {
        // This will tell your API to keep the existing image
        formData.append('keepExistingImage', 'true');
      }

      // Determine the correct endpoint
      const endpoint = mode === 'create' ? '/api/addproject' : `/api/updatePost/${defaultValues.id}`;
      
      // Submit the form
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        body: formData,
        // Don't set Content-Type header when sending FormData
        // The browser will automatically set it with the correct boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save portfolio item');
      }

      // Handle successful submission (for create mode)
      if (mode === 'create') {
        // Redirect after successful creation
        router.push('/');
        router.refresh();
      }
      // For edit mode, we'll let the parent component handle success

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Form submission error:', err);
      throw err; // Rethrow to allow parent component to handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Function to remove the current image
  const handleRemoveImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormValues(prev => ({ ...prev, image: null }));
    setImagePreview(null);
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
    handleRemoveImage,
  };
}