export default {
  expo: {
    name: "Hazlo",
    slug: "hazlo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.hazlo.app",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "bc196164-f98b-4cc8-93b5-49207f5cf912"
      }
    }
  }
};
