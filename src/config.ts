/**
 * UniConnect API Configuration
 * - Connected to Railway cloud backend for worldwide access.
 * - Can be overridden locally via EXPO_PUBLIC_API_URL env variable.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://web-production-66b7d.up.railway.app';


