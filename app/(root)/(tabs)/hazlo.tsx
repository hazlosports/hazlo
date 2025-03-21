import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"; // Added Marker
import * as Location from "expo-location"; // Import expo-location

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
        borderColor: "white",
        padding: "2%",
      }}
    />
  </View>
);

export default function Hazlo() {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // To store the selected location
  const router = useRouter();

  useEffect(() => {
    // Set a fixed location for San Francisco
    setRegion({
      latitude: 37.7749, // San Francisco latitude
      longitude: -122.4194, // San Francisco longitude
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, []);

  // Handle long press to set pin and log location
  const handleLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Set the selected location to show the pin
    setSelectedLocation({ latitude, longitude });

    // Log the location
    console.log("Location pressed:", { latitude, longitude });
  };

  if (!region) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.headerText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.headerText}>HAZLO</Text>

        {/* MapView with Google Maps and custom styling */}
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={false} // No need to show user location
          provider={PROVIDER_GOOGLE} // Enable Google Maps provider
          customMapStyle={mapStyle} // Apply custom map style
          onLongPress={handleLongPress} // Add long press event handler
        >
          {/* If there's a selected location, place a pin there */}
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>

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

// Custom Map Style: Removes labels for shops, roads, and transit
const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off",
      },
    ],
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off",
      },
    ],
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off",
      },
    ],
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off",
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
    borderRadius: 50,
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
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
