import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/types/project';

export interface AuthStore {
  token: string | null;
  expiresAt: number | null;
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
      expiresAt: null,
      username: '',
      isAdmin: false,
      projects: [],
      selectedProject: null,
      setSelectedProject: async (project) => {
        const response = await get().authFetch(`/api/auth/role?projectId=${project.id}`);

        if (!response.ok) {
          throw new Error('프로젝트 정보를 가져오지 못했습니다.');
        }

        const { role } = await response.json();
        set({ selectedProject: { ...project, role } });

        console.log(role);
      },
      authFetch: async (input, init) => {
        const { token, expiresAt, logout } = get();

        if (!token || !expiresAt || Date.now() > expiresAt) {
          logout();
          toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
          throw new Error('세션 만료');
        }

        return fetch(input, {
          ...init,
          headers: { ...init?.headers, 'X-Subject-Token': token },
        });
      },
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
        const expiresAt = Date.now() + 30 * 60 * 1000;

        set({ token, username, isAdmin, projects, expiresAt });
        await get().setSelectedProject(projects[0]);

        setTimeout(() => {
          toast.error('로그인 세션이 만료되었습니다');
          get().logout();
        }, 30 * 60 * 1000);
      },
      logout: () =>
        set({ token: null, expiresAt: null, username: '', isAdmin: false, projects: [], selectedProject: null }),
    }),
    {
      name: 'authStorage',
      onRehydrateStorage: () => (state) => {
        if (state?.expiresAt && Date.now() > state.expiresAt) {
          state.logout();
          toast.error('로그인 세션이 만료되었습니다');
        }
      },
    }
  )
);
