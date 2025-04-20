import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Haptics from "expo-haptics";

import UserMarker from "@/components/UserMarker";
import { getMapItemsByBounds, GetMapItemsResponse } from "@/services/mapService";
import MapHelper from "@/components/MapHelper";

const MapPinWithPlus = ({ pinColor, plusColor }: { pinColor: string; plusColor: string }) => (
  <View style={{ position: "relative" }}>
    <MapPin size={24} color={pinColor} />
    <Plus
      size={16}
      color={plusColor}
      style={{
        position: "absolute",
        top: "-30%",
        right: "-30%",
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

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locations, setLocations] = useState<GetMapItemsResponse>([]);
  const [isMapDisabled, setIsMapDisabled] = useState(false); // 👈 control map interactions

  const router = useRouter();

  // Set initial region
  useEffect(() => {
    setRegion({
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, []);

  // Debounced fetchMapItems when region changes
  useEffect(() => {
    const fetchMapItems = async () => {
      if (!region) return;
      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
      const minLat = latitude - latitudeDelta / 2;
      const maxLat = latitude + latitudeDelta / 2;
      const minLng = longitude - longitudeDelta / 2;
      const maxLng = longitude + longitudeDelta / 2;

      try {
        const fetchedLocations = await getMapItemsByBounds(minLat, maxLat, minLng, maxLng);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching map items:", error);
      }
    };

    const timeout = setTimeout(fetchMapItems, 500); // 500ms debounce

    return () => clearTimeout(timeout);
  }, [region]);

  const handleLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setUserLocation({ latitude, longitude });
    Haptics.selectionAsync(); // haptic feedback
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
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          initialRegion={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          onLongPress={handleLongPress}

          scrollEnabled={!isMapDisabled}
          zoomEnabled={!isMapDisabled}
          pitchEnabled={!isMapDisabled}
          rotateEnabled={!isMapDisabled}
          zoomTapEnabled={!isMapDisabled}
          zoomControlEnabled={!isMapDisabled}
        >
          {userLocation && <UserMarker coordinate={userLocation} />}

          {locations.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.location.lat,
                longitude: item.location.long,
              }}
              onPress={() => console.log("markertap")} // tap marker to view details
            />
          ))}
        </MapView>

        <View style={styles.mapHelperWrapper}>
        <MapHelper items={locations} onExpandChange={setIsMapDisabled} />
        </View>

        <Pressable
          style={[
            styles.floatingPostButton,
            {
              backgroundColor: userLocation ? "#692EF8" : "#E5E5E5",
            },
          ]}
          onPress={() =>
            userLocation &&
            router.navigate(
              `/actionScreen?component=newEvent&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`
            )
          }
        >
          <MapPinWithPlus
            pinColor={userLocation ? "#E5E5E5" : "#692EF8"}
            plusColor={userLocation ? "#E5E5E5" : "#692EF8"}
          />
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1e2b38" }], // dark blue background
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#cfd8dc" }], // soft grey text
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1e2b38" }], // matches background
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2c3e50" }], // muted steel blue
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a2733" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }], // dark navy
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#546e7a" }], // cool grey
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
    bottom: "15%",
    right: "5%",
    backgroundColor: "#692EF8",
    borderRadius: 50,
    padding: "5%",
    zIndex: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  mapHelperWrapper:
  {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 2,
  }
});
