import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.511a901370494b6d9713a950e943af89",
  appName: "walletflow-new",
  webDir: "dist",
  server: {
    url: "https://511a9013-7049-4b6d-9713-a950e943af89.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
