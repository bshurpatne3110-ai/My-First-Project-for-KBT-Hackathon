import { mockTeam } from '@/data/mockData';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  project: string;
  status: string;
};

const TEAM_STORAGE_KEY = 'buildmaster-team';

export const getStoredTeam = (): TeamMember[] => {
  if (typeof window === 'undefined') {
    return mockTeam;
  }

  const storedValue = localStorage.getItem(TEAM_STORAGE_KEY);
  if (!storedValue) {
    return mockTeam;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as TeamMember[];
    return Array.isArray(parsedValue) ? parsedValue : mockTeam;
  } catch {
    return mockTeam;
  }
};

export const saveStoredTeam = (team: TeamMember[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
};
