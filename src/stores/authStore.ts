import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/types/project';

export interface AuthStore {
  token: string | null;
  username: string;
  isAdmin: boolean;
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      username: '',
      isAdmin: false,
      projects: [],
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
      login: async (username, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: username, password }),
        });

        if (!response.ok) {
          throw new Error('로그인 실패');
        }

        const token = response.headers.get('X-Subject-Token')!;
        const { isAdmin, projects } = await response.json();

        set({ token, username, isAdmin, projects, selectedProject: projects[0] });
      },
      logout: () => set({ token: null, username: '', isAdmin: false, projects: [], selectedProject: null }),
    }),
    { name: 'authStorage' }
  )
);
