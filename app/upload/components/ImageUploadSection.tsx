"use client";
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadSectionProps {
  selectedImage: File | null;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  selectedImage,
  imagePreview,
  onImageChange,
  onRemoveImage,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">
        Featured Image <span className="text-red-500">*</span>
      </label>
      <div className="border-2 border-dashed rounded-lg border-[#0F9B99] p-3 bg-gray-900/60">
        {!imagePreview ? (
          <div className="flex flex-col items-center justify-center py-5 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm mt-2 text-gray-300">Drag & drop or click to select an image</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 1MB</p>
            <input
              type="file"
              className="hidden"
              id="image-upload"
              accept="image/*"
              onChange={onImageChange}
            />
            <label
              htmlFor="image-upload"
              className="mt-3 inline-flex items-center rounded-md bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] px-4 py-2 text-sm font-medium text-white hover:opacity-90 cursor-pointer"
            >
              Select Image
            </label>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={onRemoveImage}
              type="button"
              className="absolute -right-2 -top-2 bg-gray-800 rounded-full p-1 border border-[#0F9B99] shadow-md"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-[200px] mx-auto rounded object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadSection;
