"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import FormFields from './FormFields';
import { useSession } from '@clerk/nextjs';
import { formSchema } from './types';
import { ShinyButton } from '@/components/magicui/shiny-button';


const categories = [
    'Event', 'Publication', 'Infographic'
    ,'Education'
];

const UploadForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { session } = useSession();
  const token = session?.getToken();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>(categories);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
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
    setIsSubmitting(true);

    try {
      // Check if a new category was added
      const categoryValue = data.category;
      if (categoryValue && !categories.includes(categoryValue)) {
        // If this is a new category, add it to our list
        setAllCategories(prev => [...prev, categoryValue]);
      }

      // Create FormData object to handle file upload
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('title', data.title);
      formData.append('content', data.description); // mapped from "description" to "content"
      formData.append('category', data.category);
      formData.append('client', data.client);
      if (data.videoLink) formData.append('video', data.videoLink);
      
      // Add image file if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      } else if (data.photoLink) {
        formData.append('photoLink', data.photoLink);
      }

      const response = await fetch('/api/addproject', {
        method: 'POST',
        headers : {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Portfolio item has been added successfully",
        });

        reset();
        setSelectedImage(null);
        setImagePreview(null);
        if (onSuccess) onSuccess();
      } else {
        const err = await response.json();
        toast({
          title: "Error!",
          description: err.message || "Portfolio item was not added",
        });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload portfolio item",
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
          categories={allCategories}
          setValue={setValue}
          watch={watch}
        />

        <ImageUploadSection
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />

        <div>
            <ShinyButton
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-white shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                Upload Portfolio Item
              </>
            )}
          </ShinyButton>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;