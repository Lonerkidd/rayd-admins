import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToSupabase = async (
  file: File,
  bucket: string = 'blog-images'
): Promise<{ url: string; error: Error | null }> => {
  try {
    // Generate a unique filename to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { 
      url: publicUrlData.publicUrl, 
      error: null 
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      url: '', 
      error: error instanceof Error ? error : new Error('Unknown error occurred during upload') 
    };
  }
};

// Helper function to validate file before upload
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'File type not supported. Please upload JPEG, PNG, WebP or GIF.' 
    };
  }

  // Check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File size too large. Please upload an image smaller than 5MB.' 
    };
  }

  return { valid: true };
};