import { mockProjects } from '@/data/mockData';

export type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
};

const PROJECTS_STORAGE_KEY = 'buildmaster-projects';

export const getStoredProjects = (): Project[] => {
  if (typeof window === 'undefined') {
    return mockProjects;
  }

  const storedValue = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!storedValue) {
    return mockProjects;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Project[];
    return Array.isArray(parsedValue) ? parsedValue : mockProjects;
  } catch {
    return mockProjects;
  }
};

export const saveStoredProjects = (projects: Project[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};