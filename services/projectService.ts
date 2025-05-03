import { Project } from '@/types';

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch('/api/getproject', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

export const createProject = async (project: Omit<Project, '_id'>): Promise<Project> => {
  try {
    const response = await fetch('/api/addproject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  try {
    const response = await fetch(`/api/updatePost/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/deletePost/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<Project> => {
  try {
    // This is a workaround since there's no specific endpoint to get a project by ID
    // We'll fetch all projects and filter by ID
    const projects = await fetchProjects();
    const project = projects.find(p => p._id === id);
    
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    return project;
  } catch (error) {
    console.error(`Failed to fetch project ${id}:`, error);
    throw error;
  }
};
