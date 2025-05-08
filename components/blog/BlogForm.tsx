'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { BlogFormProps } from '@/types';
import useBlogForm from '@/hooks/use-blog';
import { AlertCircle } from 'lucide-react';

export function BlogForm({ defaultValues, mode, onSubmit }: BlogFormProps) {
  const {
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
  } = useBlogForm(defaultValues, mode);

  // Fixed predefined categories - you can modify this or fetch from your database
  const categories = ['Web Design', 'Mobile App', 'Branding', 'UI/UX', 'Illustration'];
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setIsNewCategory(true);
      setNewCategory('');
      // Don't update form values yet
    } else {
      setIsNewCategory(false);
      // Update form values with selected category
      formValues.category = value;
    }
  };

  // Handle new category input
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategory(value);
    // Update form values with new category
    formValues.category = value;
  };

  // Custom submit handler to pass control to parent component
  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(e);
      if (onSubmit) {
        await onSubmit(formValues);
      }
    } catch (error) {
      // Error is already set in the hook
      console.error("Form submission failed:", error);
    }
  };

  return (
    <Card className="p-4 md:p-6 border border-gray-200 shadow-lg bg-black backdrop-blur-sm text-white">
      <form onSubmit={submitFormHandler} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 mb-4 border border-red-200">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Enter portfolio title"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-base text-white font-medium">Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formValues.content}
                onChange={handleChange}
                placeholder="Write your portfolio content..."
                rows={12}
                required
                className="min-h-[250px] resize-y"
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-base text-white font-medium">Featured Image</Label>
              <div className="mt-2 space-y-4">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={handleFileSelect}
                  >
                    <div className="mx-auto flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileSelect}
                    className="w-full"
                  >
                    Change Image
                  </Button>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white font-medium">Category</Label>
              <select
                id="category"
                name="category"
                onChange={handleCategoryChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background"
                value={isNewCategory ? 'add_new' : formValues.category}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="add_new">+ Add New</option>
              </select>

              {isNewCategory && (
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-700 shadow-sm focus:border-[#0F9B99] focus:ring-[#0F9B99] bg-gray-800 px-3 py-2 text-sm border text-white mt-2"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                />
              )}
            </div>

            {/* Client Input */}
            <div className="space-y-2">
              <Label htmlFor="client" className="text-white font-medium">Client</Label>
              <Input
                id="client"
                name="client"
                value={formValues.client || ''}
                onChange={handleChange}
                placeholder="Enter client name"
              />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="video" className="text-white font-medium">Video URL</Label>
              <Input
                id="video"
                name="video"
                value={formValues.video || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] hover:opacity-90"
            >
              {isSubmitting
                ? 'Saving...'
                : mode === 'create'
                ? 'Create Portfolio Item'
                : 'Update Portfolio Item'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}