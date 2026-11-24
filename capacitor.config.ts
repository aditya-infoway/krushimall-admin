import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.krushimall.app',
  appName: 'KrushiMall',
  webDir: 'dist',

  server: {
    androidScheme: 'http',
    cleartext: true,
  },

  android: {
    allowMixedContent: true,
  },
};

export default config;