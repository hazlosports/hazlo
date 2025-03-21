import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet, Alert } from "react-native";
import { getFileFromBucket } from "@/services/imageService";
import { useLocalSearchParams } from "expo-router";
import { HazloEvent, subscribeToEvent } from "@/services/eventService";
import { Button } from "@/components/UI/Button";
import { supabase } from "@/lib/supabase"; // Ensure you have access to auth
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventDetailsScreen() {
  const { event } = useLocalSearchParams<{ event: string }>();
  const eventData: HazloEvent = JSON.parse(event);

  const [folderPath, fileName] = eventData.banner ? eventData.banner.split("/") : ["", ""];
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBannerUri = async () => {
      if (!folderPath || !fileName) return;
      const uri = await getFileFromBucket("eventBanners", folderPath, fileName);
      if (uri) {
        setBannerUri(uri.uri);
      }
    };

    fetchBannerUri();
  }, [folderPath, fileName]);

  const handleRegister = async () => {
    setLoading(true);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Error", "You must be logged in to register for an event.");
      setLoading(false);
      return;
    }

    // Subscribe user to event
    const result = await subscribeToEvent(user.id, eventData.id, "registered");

    if (result.success) {
      Alert.alert("Success", "You are now registered for this event!");
    } else {
      Alert.alert("Error", result.msg);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      {/* Event Banner */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={bannerUri ? { uri: bannerUri } : require("@/assets/images/defaultBanner.png")}
          resizeMode="cover"
          style={styles.banner}
        />
      </View>

      {/* Event Info */}
      <View style={styles.detailsContainer}>
        <Text style={styles.eventName}>{eventData.name}</Text>
        <Text style={styles.eventDate}>{formatDate(eventData.date)}</Text>
        <Text style={styles.eventLocation}>{eventData.location}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{eventData.description}</Text>
      </View>

      {/* Register Button */}
      <Button title="Register" onPress={handleRegister} loading={loading} />
    </SafeAreaView>
  );
}

// Helper function to format date
function formatDate(date: string) {
  const parsedDate = new Date(date);
  return (
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(parsedDate) +
    " " +
    parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  bannerContainer: {
    height: 200, // Adjust height as needed
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 16,
    color: "gray",
  },
  eventLocation: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
});
