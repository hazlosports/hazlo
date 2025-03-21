import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(profile)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="rolePicker" />
        <Stack.Screen name="sportPicker" />
        <Stack.Screen
          name="post"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="actionScreen" />
      </Stack>
    </SafeAreaProvider>
  );
}
