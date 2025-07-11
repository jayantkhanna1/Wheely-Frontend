export default {
  name: "Wheely",
  slug: "wheely",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "wheely",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#059669"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.wheely.app"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#059669"
    },
    package: "com.wheely.app",
    permissions: [
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/favicon.png"
  },
  plugins: ["expo-router", "expo-font", "expo-web-browser"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
};