'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToSupabase, validateImage } from '@/lib/uploadImage';
import { BlogFormProps, FormValues } from '@/types';


// Custom hook to separate form logic
export default function useBlogForm(defaultValues?: BlogFormProps['defaultValues'], mode: 'create' | 'edit' = 'create') {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(typeof defaultValues?.image === 'string' ? defaultValues.image : null);
    const [formValues, setFormValues] = useState<FormValues>({
      title: defaultValues?.title || '',
      content: defaultValues?.content || '',
      slug: defaultValues?.slug || '',
      excerpt: defaultValues?.excerpt || '',
      tags: Array.isArray(defaultValues?.tags) ? defaultValues.tags.join(', ') : '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormValues((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      // Validate the image
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error!);
        return;
      }
  
      // Set image for preview
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setError(null);
      
      return () => URL.revokeObjectURL(objectUrl);
    };
  
    const handleFileSelect = () => {
      fileInputRef.current?.click();
    };
  
    const handleCancel = () => {
      router.back();
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
  
      try {
        // Process form data
        const formData = {
          title: formValues.title,
          content: formValues.content,
          slug: formValues.slug || undefined,
          author:formValues.author || "admin",
          excerpt: formValues.excerpt || undefined,
          tags: formValues.tags ? formValues.tags.split(',').map(tag => tag.trim()) : [],
        };
  
        // Upload image if a new one is selected
        let imageUrl = defaultValues?.image || '';
        if (imageFile) {
          const uploadResult = await uploadImageToSupabase(imageFile);
          if (uploadResult.error) {
            throw new Error(`Failed to upload image: ${uploadResult.error.message}`);
          }
          imageUrl = uploadResult.url;
        }
  
        const payload = {
          ...formData,
          image: imageUrl,
        };
  
        // Determine API endpoint based on mode
        const endpoint = mode === 'create'
          ? '/api/addPost'
          : `/api/updatePost/${defaultValues?.id}`;
  
        const method = mode === 'create' ? 'POST' : 'PUT';
  
        // Send request to API
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save blog post');
        }
  
        // On success, redirect to blog list or edit page
        router.push('/dashboard');
        router.refresh(); // Refresh the dashboard to show updated data
      } catch (err) {
        console.error('Error saving blog post:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsSubmitting(false);
      }
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
      mode
    };
  }