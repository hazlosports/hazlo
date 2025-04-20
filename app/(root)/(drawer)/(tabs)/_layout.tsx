import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: "1%",
          backgroundColor: "#0f0f0f",
          borderTopColor: "#1e1e1e", // Slightly transparent black background
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color="white"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hazlo"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "globe" : "globe-outline"}
              size={size}
              color="white"
            />
          ),
        }}
      />
    </Tabs>
  );
}
