'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { BlogFormProps } from '@/types';
import useBlogForm from '@/hooks/use-blog';
import { AlertCircle } from 'lucide-react';

// UI Component separated from logic
export function BlogForm({ defaultValues, mode }: BlogFormProps) {
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
  } = useBlogForm(defaultValues, mode);

  return (
    <Card className="p-4 md:p-6 border border-gray-200 shadow-lg bg-black backdrop-blur-sm text-white">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="title" className=" text-white font-medium">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Enter post title"
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
                placeholder="Write your post content..."
                rows={12}
                required
                className="min-h-[250px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-base text-white font-medium">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formValues.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of your post"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to auto-generate from content
              </p>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-base text-white font-medium">Featured Image</Label>
              <div className="mt-2 space-y-4">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-200">
                    {mode === "edit" && defaultValues?.id ? (
                      // For edit mode, use the API endpoint to fetch the image
                      <Image
                        src={`/api/image/${defaultValues.id}`}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      // For new uploads or changed images, use the data URL
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    )}
                    <button 
                      type="button"
                      onClick={() => {
                        // Clear image selection
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        // Reset the image preview
                        formValues.image = null;
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors" onClick={handleFileSelect}>
                    <div className="mx-auto flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 1MB</p>
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
            
            <div className="space-y-2">
              <Label htmlFor="category" className=" text-white font-medium">Category</Label>
              <select
                id="category"
                name="category"
                value={formValues.category || ''}
                onChange={()=>handleChange}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background"
              >
                <option value="" disabled>Select a category</option>
                <option value="web-design">Web Design</option>
                <option value="branding">Branding</option>
                <option value="development">Development</option>
                <option value="marketing">Marketing</option>
                <option value="strategy">Strategy</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className=" text-white font-medium">Client</Label>
              <Input
                id="client"
                name="client"
                value={formValues.client || ''}
                onChange={handleChange}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className=" text-white font-medium">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formValues.tags}
                onChange={handleChange}
                placeholder="design, marketing, branding"
              />
              <p className="text-xs text-muted-foreground">Separate with commas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className=" text-white font-medium">URL Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formValues.slug}
                onChange={handleChange}
                placeholder="custom-url-slug"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="video" className=" text-white font-medium">Video URL</Label>
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
                  ? 'Create Post' 
                  : 'Update Post'
              }
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