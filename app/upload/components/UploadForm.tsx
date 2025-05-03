"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import FormFields from './FormFields';
import { formSchema } from './types';
import axios from 'axios';
import { Check } from 'lucide-react';

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
    console.log('Form data:', data);
    // Check if an image is selected or a photo link is provided
    setIsSubmitting(true);
    // if (!selectedImage && !data.photoLink) {
    //   toast({
    //     title: "Image required",
    //     description: "Please upload an image or provide a photo link",
    //   });
    //   return;
    // }

    
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
      
      // Handle image differently: either upload file or use photoLink
      if (selectedImage) {
        formData.append('image', selectedImage);
        // Set a flag to indicate we're uploading a file
        formData.append('imageType', 'file');
      } else if (data.photoLink) {
        formData.append('photoLink', data.photoLink);
        // Set a flag to indicate we're using a URL
        formData.append('imageType', 'url');
      }
      
      console.log('Submitting form data:', Object.fromEntries(formData));
      
      // Submit directly to the API endpoint
      const response = await axios.post('/api/addproject', formData);
      
      console.log('Server response:', response);
      
      if (response.status === 200) {
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
      } else {
        toast({
          title: "Error!",
          description: "Portfolio item has not been added",
        });
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to upload portfolio item",
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
                    <Check className="mr-1 h-4 w-4" />
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