import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="editProfile" />
      <Stack.Screen
        name="calendar"
        options={{
          headerShown: true,
          title: "Calendar", // Title in camelCase
          headerStyle: {
            backgroundColor: "#0e0e0e",
          },
          headerTitleStyle: {
            color: "white", // Optional: You can set the title color to white or any color you prefer
            fontWeight: "bold",
          },
          headerBackButtonDisplayMode: "minimal",
          headerTintColor: "white", // Optional: Set the color of the header icons (like the back arrow) to white
        }}
      />
    </Stack>
  );
}
