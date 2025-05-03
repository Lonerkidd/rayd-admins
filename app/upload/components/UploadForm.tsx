"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import FormFields from './FormFields';
import { formSchema } from './types';
import { Check } from 'lucide-react';
import { uploadImage } from '@/lib/api'; // Make sure this is a function that uploads the image and returns { url }

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
    setIsSubmitting(true);

    try {
      let imageUrl = data.photoLink || '';

      // If an image file is selected, upload it and get URL
      if (selectedImage) {
        const uploadRes = await uploadImage(selectedImage); // should return { url }
        imageUrl = uploadRes?.url || '';
      }

      const payload = {
        title: data.title,
        content: data.description, // mapped from "description" to "content"
        category: data.category,
        client: data.client,
        video: data.videoLink || '',
        image: imageUrl,
      };

      const response = await fetch('/api/addproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
          categories={categories}
        />

        <ImageUploadSection
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center w-full md:w-auto rounded-md bg-raydawn-purple px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-raydawn-dark-purple focus:outline-none focus:ring-2 focus:ring-raydawn-purple focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
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
                <Check className="mr-1 h-4 w-4 border-2 rounded" />
                Upload Portfolio Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
