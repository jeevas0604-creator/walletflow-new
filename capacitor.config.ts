import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lovable.walletflow",
  appName: "walletflow-new",
  webDir: "dist",
  // Remove server config for production APK builds
  // For development, uncomment the server section below
  /*
  server: {
    url: "https://511a9013-7049-4b6d-9713-a950e943af89.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  */
  android: {
    allowMixedContent: true,
    permissions: [
      "android.permission.READ_SMS",
      "android.permission.RECEIVE_SMS"
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    }
  }
};

export default config;
