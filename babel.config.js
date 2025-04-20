module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo", // This is the main Expo preset
    ],
    plugins: [
      "nativewind/babel", // Use if you're using NativeWind for styling
      "react-native-reanimated", // If you're using Reanimated (optional)
    ],
  };
};