// src/components/lib/api.ts
import axios from 'axios';
import { PortfolioItem } from '@/types';


export async function uploadImage(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'portfolio'); // Optional: to categorize uploads
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload image');
      }
  
      const data = await response.json();
      return { url: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
  
  
  export async function addPost(portfolioItem: PortfolioItem): Promise<PortfolioItem> {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioItem),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add portfolio item');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }
  
// Get all posts
export async function getPosts(): Promise<PortfolioItem[]> {
  try {
    const response = await fetch('/api/getproject', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch posts');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// Get a single post by ID
export async function getPostById(id: string): Promise<PortfolioItem> {
  try {
    const response = await fetch(`/api/portfolio/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch post');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

// Create a new post with FormData (for file uploads)
export async function createPost(formData: FormData): Promise<PortfolioItem> {
  try {
    const response = await axios.post('/api/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Update an existing post
export async function updatePost(id: string, data: FormData | Partial<PortfolioItem>): Promise<PortfolioItem> {
  try {
    let response;
    
    // Check if we're sending FormData or JSON
    if (data instanceof FormData) {
      response = await axios.put(`/api/portfolio/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.put(`/api/updatePost/${id}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a post
export async function deletePost(id: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/deletePost/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }

    return response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}