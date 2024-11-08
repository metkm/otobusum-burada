import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Otobüsüm Burada",
  slug: "otobusum-burada",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "otobusum-burada",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0a0a0a",
  },
  ios: {
    supportsTablet: true,
  },
  androidStatusBar: {
    barStyle: "light-content",
    translucent: true,
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_MAP_API,
      },
    },
    softwareKeyboardLayoutMode: "pan",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0a0a0a",
    },
    package: "com.anonymous.otobusumburada",
  },
  plugins: ["expo-router", "expo-localization"],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
