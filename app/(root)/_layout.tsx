import { Stack } from "expo-router";

export default function Layout() {
  return (
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
  );
}
