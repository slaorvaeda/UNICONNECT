/**
 * UNICONNECT - Light theme (matching login design)
 * Clean, minimalist palette
 */
export const colors = {
  // Primary / accents
  primary: '#2D2D2D',
  primaryDark: '#1A1A1A',
  primaryLight: '#4A4A4A',

  // Backgrounds
  background: '#FAF9F7',
  backgroundSecondary: '#F5F3F0',
  surface: '#FFFFFF',

  // Cards / inputs
  cardBg: '#FFFFFF',
  cardBorder: '#E5E2DE',
  inputBorder: '#E5E2DE',

  // Text
  textPrimary: '#2D2D2D',
  textSecondary: '#9E9E9E',
  textMuted: '#B0B0B0',

  // Status (keep for badges)
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Role accents
  studentAccent: '#2D2D2D',
  teacherAccent: '#2D2D2D',
  adminAccent: '#2D2D2D',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
