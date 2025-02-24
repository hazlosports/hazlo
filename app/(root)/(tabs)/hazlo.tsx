import { StyleSheet, View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";

const MapPinWithPlus = () => (
  <View style={{ position: "relative" }}>
    <MapPin size={24} color="white" />
    <Plus
      size={16}
      color="white"
      style={{
        position: "absolute",
        top: "-30%",
        right: "-30%",
        borderColor : "white",
        padding: "2%",
      }}
    />
  </View>
);

export default function Hazlo() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.headerText}>HAZLO</Text>

        {/* Floating Post Button */}
        <Pressable
          style={styles.floatingPostButton}
          onPress={() => router.navigate("/actionScreen?component=newEvent")}
        >
          <MapPinWithPlus />
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Added background for clarity
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  floatingPostButton: {
    position: "absolute",
    bottom: "6%",
    right: "5%",
    backgroundColor: "#692EF8",
    borderRadius: "50%",
    padding: "5%",
    zIndex: 1,

    // Shadow for iOS
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,

    // Shadow for Android
    elevation: 5,
  },
});
