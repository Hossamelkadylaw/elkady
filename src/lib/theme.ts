import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

// Colors mirror global.css variables exactly
export const THEME = {
  light: {
    background: '#0b1422',
    foreground: '#f8fafc',
    card: '#142136',
    cardForeground: '#f8fafc',
    popover: '#142136',
    popoverForeground: '#f8fafc',
    primary: '#eab308',
    primaryForeground: '#0b1422',
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#eab308',
    accentForeground: '#0b1422',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#1e3352',
    input: '#15253e',
    ring: '#eab308',
    radius: '0.75rem',
  },
  dark: {
    background: '#0b1422',
    foreground: '#f8fafc',
    card: '#142136',
    cardForeground: '#f8fafc',
    popover: '#142136',
    popoverForeground: '#f8fafc',
    primary: '#eab308',
    primaryForeground: '#0b1422',
    secondary: '#1e293b',
    secondaryForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#eab308',
    accentForeground: '#0b1422',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#1e3352',
    input: '#15253e',
    ring: '#eab308',
    radius: '0.75rem',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
