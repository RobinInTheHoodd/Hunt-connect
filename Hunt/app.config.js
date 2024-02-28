export default {
  expo: {
    name: "Hunt",
    slug: "Hunt",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ios.huntconnect",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.android.huntconnect",
      permissions: ["android.permission.RECORD_AUDIO"],
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: "HuntConnect",
    plugins: [
      "expo-image-picker",
      "expo-secure-store",
      "expo-router",
      "@react-native-google-signin/google-signin",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.FACEBOOK_APP_ID,
          clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
          displayName: "Hunt",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "7e82308f-19ad-4c67-911c-6d2c46adf1dd",
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL_GOOGLE_WEB_ID,
    },
  },
};
