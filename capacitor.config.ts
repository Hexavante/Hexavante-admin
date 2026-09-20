import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.hexavante.app',
  appName: 'Hexavante',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#0b1220',
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#0b1220',
      showSpinner: true,
      spinnerColor: '#0ea5e9',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;
