"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import FormFields from './FormFields';
import SubmitButton from './SubmitButton';
import { formSchema } from './types';
import axios from 'axios';

const categories = [
  'infographic', 'branding', 'illustration', 
  'web design', 'print', 'video', 'animation'
];

const UploadForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      client: '',
      videoLink: '',
      photoLink: '',
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: any) => {
    if (!selectedImage && !data.photoLink) {
      toast({
        title: "Image required",
        description: "Please upload an image or provide a photo link",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for submission
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('title', data.title);
      formData.append('content', data.description); // Map description to content
      formData.append('category', data.category);
      formData.append('client', data.client);
      
      // Add optional fields if they exist
      if (data.videoLink) formData.append('videoLink', data.videoLink);
      if (data.photoLink) formData.append('photoLink', data.photoLink);
      
      // Add image file if selected, otherwise use photoLink
      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (data.photoLink) {
        formData.append('image', data.photoLink);
      }
      
      // Submit directly to the API endpoint
      const response = await axios.post('/api/portfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({
        title: "Success!",
        description: "Portfolio item has been added successfully",
      });
      
      // Reset form
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      
      // Trigger callback
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload portfolio item",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-md border border-[#0F9B99]/70 p-4">
      <h2 className="text-2xl font-heading font-medium mb-4 text-white">Upload New Portfolio Item</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormFields 
          register={register} 
          errors={errors}
          categories={categories}
        />
        
        <ImageUploadSection 
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />
        
        <div>
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
};

export default UploadForm;