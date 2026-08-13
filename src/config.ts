import { Platform } from 'react-native';

/**
 * Configure your server IP here.
 * - For iOS Simulator, 'localhost' or '127.0.0.1' works.
 * - For Android Emulator, '10.0.2.2' maps to your computer's localhost.
 * - For a physical device running Expo Go, replace this with your computer's local IP address (e.g., '192.168.1.X').
 */
const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP || '192.168.1.19';

export const API_BASE_URL = Platform.select({
  ios: `http://${LOCAL_IP}:5001`,
  android: `http://10.0.2.2:5001`,
  default: `http://${LOCAL_IP}:5001`,
});
