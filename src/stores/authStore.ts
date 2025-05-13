import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/types/project';

export interface AuthStore {
  token: string | null;
  username: string;
  isAdmin: boolean;
  projects: Project[];
  selectedProject: (Project & { role: string }) | null;
  setSelectedProject: (project: Project) => Promise<void>;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      username: '',
      isAdmin: false,
      projects: [],
      selectedProject: null,
      setSelectedProject: async (project) => {
        const response = await fetch(`/api/auth/role?projectId=${project.id}`, {
          headers: { 'X-Subject-Token': get().token! },
        });

        if (!response.ok) {
          throw new Error('프로젝트 정보를 가져오지 못했습니다.');
        }

        const { role } = await response.json();
        set({ selectedProject: { ...project, role } });

        console.log(role);
      },
      authFetch: async (input, init) =>
        fetch(input, {
          ...init,
          headers: { ...init?.headers, 'X-Subject-Token': get().token! },
        }),
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

        set({ token, username, isAdmin, projects });
        get().setSelectedProject(projects[0]);
      },
      logout: () => set({ token: null, username: '', isAdmin: false, projects: [], selectedProject: null }),
    }),
    { name: 'authStorage' }
  )
);
