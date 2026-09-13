import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';
import { create } from 'zustand';
import { getThemePreference, saveThemePreference } from '@/lib/theme-toggle';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Theme = 'light' | 'dark';

export function resolveTheme(mode: ThemeMode): Theme {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

interface ThemeState {
  theme: ThemeMode;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',

  async loadTheme() {
    try {
      const saved = await getThemePreference();
      if (saved === 'light' || saved === 'dark') {
        set({ theme: saved });
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  },

  async toggleTheme() {
    const current = resolveTheme(get().theme);
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    set({ theme: next });
    await saveThemePreference(next);
  },
}));

export function useThemeSync() {
  const theme = useThemeStore((state) => state.theme);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme === 'system' ? 'system' : theme);
  }, [theme, setColorScheme]);

  return { theme: resolveTheme(theme) };
}