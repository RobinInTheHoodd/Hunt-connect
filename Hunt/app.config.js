export default {
  expo: {
    name: "Hunt",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    slug: "Hunt",
    updates: {
      url: "https://u.expo.dev/7e82308f-19ad-4c67-911c-6d2c46adf1dd",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ios.huntconnect",
      googleServicesFile: "/home/robin/Downloads/g_service.json", //process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMapsApiKey: "",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.android.huntconnect",
      permissions: ["android.permission.RECORD_AUDIO"],
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      config: {
        googleMaps: {
          apiKey: "",
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    scheme: ["Huntconnect"],
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
          appID: "",
          clientToken: "",
          displayName: "Hunt",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Hunt Connect to use your location.",
          isAndroidForegroundServiceEnabled: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "7e82308f-19ad-4c67-911c-6d2c46adf1dd",
      },
      apiUrl: process.env.EXPO_PUBLIC_API_URL_GOOGLE_WEB_ID,
    },
  },
};
