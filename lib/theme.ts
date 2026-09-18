import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

// stellar.org design system (https://stellar.org/ecosystem):
// gold #FDDA24, ink #0F0F0F, off-white #F9F9F9, muted #F2F2F2,
// borders rgba(15,15,15,.1), red #FF3F00, teal #00A7B5, lilac #B7ACE8.
// Light: white surfaces, gold buttons w/ black text.
// Dark: near-black surfaces, black buttons w/ white text, indigo focus ring.
// Fonts: Inter (UI) + IBM Plex Mono (mono).
export const THEME = {
  light: {
    background: 'hsl(0 0% 98%)',
    foreground: 'hsl(0 0% 6%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 6%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 6%)',
    primary: 'hsl(47 98% 55%)',
    primaryForeground: 'hsl(0 0% 4%)',
    secondary: 'hsl(0 0% 95%)',
    secondaryForeground: 'hsl(0 0% 6%)',
    muted: 'hsl(0 0% 95%)',
    mutedForeground: 'hsl(0 0% 34%)',
    accent: 'hsl(0 0% 94%)',
    accentForeground: 'hsl(0 0% 6%)',
    destructive: 'hsl(15 100% 50%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 90%)',
    input: 'hsl(0 0% 90%)',
    ring: 'hsl(47 98% 55%)',
    radius: '0.625rem',
    gold: 'hsl(47 98% 55%)',
    success: 'hsl(159 63% 41%)',
    chart1: 'hsl(47 98% 55%)',
    chart2: 'hsl(15 100% 50%)',
    chart3: 'hsl(0 0% 6%)',
    chart4: 'hsl(189 100% 36%)',
    chart5: 'hsl(253 56% 69%)',
  },
  dark: {
    background: 'hsl(0 0% 6%)',
    foreground: 'hsl(0 0% 97%)',
    card: 'hsl(0 0% 10%)',
    cardForeground: 'hsl(0 0% 97%)',
    popover: 'hsl(0 0% 10%)',
    popoverForeground: 'hsl(0 0% 97%)',
    primary: 'hsl(0 0% 0%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 15%)',
    secondaryForeground: 'hsl(0 0% 97%)',
    muted: 'hsl(0 0% 12%)',
    mutedForeground: 'hsl(0 0% 65%)',
    accent: 'hsl(0 0% 15%)',
    accentForeground: 'hsl(0 0% 97%)',
    destructive: 'hsl(15 100% 55%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 16%)',
    input: 'hsl(0 0% 16%)',
    ring: 'hsl(251 79% 38%)',
    radius: '0.625rem',
    gold: 'hsl(47 98% 55%)',
    success: 'hsl(158 64% 55%)',
    chart1: 'hsl(47 98% 55%)',
    chart2: 'hsl(15 100% 55%)',
    chart3: 'hsl(0 0% 90%)',
    chart4: 'hsl(189 100% 42%)',
    chart5: 'hsl(253 56% 69%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.gold,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.gold,
      text: THEME.dark.foreground,
    },
  },
};