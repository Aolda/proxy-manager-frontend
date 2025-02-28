import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthStore {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
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
        console.log(token);

        set({ token });
      },
      logout: () => set({ token: null }),
    }),
    { name: 'authStorage' }
  )
);
