import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "@/services/imageService";
import { Button } from "@/components/UI/Button";
import { getAllSports } from "@/services/sportService";
import { Location, createOrUpdateLocation } from "@/services/locationsService";
import { HazloEvent, createOrUpdateEvent } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import { Pencil } from "lucide-react-native";
import DatePicker from "@/components/UI/DatePicker";
import { useLocalSearchParams } from "expo-router";

export default function CreateEvent() {
  const { user } = useAuth();
  const params = useLocalSearchParams();

  const latitude = Number(params?.latitude);
  const longitude = Number(params?.longitude);

  const [locationData, setLocationData] = useState<Partial<Location>>({ // Let Supabase handle ID if needed, or you can generate one
    name: "",
    address: "",
    latitude: latitude,
    longitude: longitude,
  });

  const [eventData, setEventData] = useState<HazloEvent>({
    id: "",
    host_id: user?.id || "",
    name: "",
    description: "",
    date: new Date().toISOString(),
    location_id: "",
    sport_id: 0,
    banner: "",
    created_at: "",
  });

  const [sports, setSports] = useState<{ label: string; value: number }[]>([]);
  const [selectedSport, setSelectedSport] = useState<{ label: string; value: number } | null>(null);

  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getAllSports();
        if (response.success && response.data) {
          setSports(response.data.map((sport) => ({ label: sport.name, value: sport.id })));
        } else {
          alert("Failed to load sports.");
        }
      } catch {
        alert("Failed to load sports.");
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  const onPickBannerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access media library is required to select a banner image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setEventData((prev) => ({ ...prev, banner: result.assets[0].uri }));
    }
  };

  const onSubmit = async () => {
    const { host_id, name, description, date, banner } = eventData;

    let missingFields: string[] = [];

    if (!name) missingFields.push("Event name");
    if (!description) missingFields.push("Description");
    if (!date) missingFields.push("Date");
    if (!venueName) missingFields.push("Venue name");
    if (!selectedSport) missingFields.push("Sport");

    if (missingFields.length > 0) {
      Alert.alert("Event", `Please fill the following required fields:\n- ${missingFields.join("\n- ")}`);
      return;
    }

    setLoading(true);

    // Step 1: Submit location
    const locationPayload: Partial<Location> = {
      ...locationData,
      name: venueName,
      address: venueAddress || "",
    };

    const locationResponse = await createOrUpdateLocation(locationPayload);

    if (!locationResponse.success || !locationResponse.data) {
      Alert.alert("Error", "Failed to save location.");
      setLoading(false);
      return;
    }

    const location_id = locationResponse.data.id;

    // Step 2: Upload banner
    let bannerRes = banner ? await uploadFile("eventBanners", banner, "banner") : null;
    if (banner && !bannerRes?.success) {
      Alert.alert("Error", "Failed to upload banner. Please try again.");
      setLoading(false);
      return;
    }

    // Step 3: Create event
    const eventDetails: Partial<HazloEvent> = {
      host_id,
      name,
      description,
      date,
      location_id,
      sport_id: selectedSport?.value ?? 0,
      banner: bannerRes ? String(bannerRes.data) : banner,
    };

    try {
      const response = await createOrUpdateEvent(eventDetails);
      if (response.success) {
        Alert.alert("Event", "Event created successfully!");
      } else {
        Alert.alert("Error", "Failed to create event.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the event.");
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleDateChange = (date: string) => {
    setEventData({ ...eventData, date: new Date(date).toISOString() });
    setDatePickerVisible(false);
  };

  const toggleDatePicker = () => setDatePickerVisible((prev) => !prev);

  const formatDate = (date: string) => {
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
  };

  return (
    <SafeAreaProvider>
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={eventData?.banner ? { uri: eventData.banner } : require("../assets/images/defaultBanner.png")}
          resizeMode="cover"
        >
          <View style={styles.buttonPosition}>
            <TouchableOpacity style={styles.button} onPress={onPickBannerImage}>
              <Pencil size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={eventData.name}
            onChangeText={(text) => setEventData({ ...eventData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={eventData.description}
            onChangeText={(text) => setEventData({ ...eventData, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Venue Name"
            value={venueName}
            onChangeText={setVenueName}
          />
          <TextInput
            style={styles.input}
            placeholder="Venue Address (Optional)"
            value={venueAddress}
            onChangeText={setVenueAddress}
          />

          <View style={{ padding: 20 }}>
            {!isDatePickerVisible ? (
              <TouchableOpacity
                onPress={toggleDatePicker}
                style={{ padding: 10, backgroundColor: "#007BFF", borderRadius: 5 }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {eventData.date ? formatDate(eventData.date) : "Select Date"}
                </Text>
              </TouchableOpacity>
            ) : (
              <DatePicker selectedDate={eventData.date} onDateChange={handleDateChange} modifiableYear={false} />
            )}
          </View>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            itemContainerStyle={styles.dropdownItem}
            itemTextStyle={styles.dropdownItem}
            activeColor="transparent"
            data={sports}
            labelField="label"
            valueField="value"
            value={selectedSport}
            onChange={(item) => setSelectedSport(item)}
            placeholder="Select Sport"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Create Event" size="xl" onPress={onSubmit} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#0E0E0E",
  },
  bannerContainer: {
    flex: 0.2,
  },
  banner: {
    height: "100%",
  },
  buttonPosition: {
    alignSelf: "flex-end",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "2%",
    margin: "1%",
    borderRadius: "20%",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 0.7,
    padding: "5%",
  },
  input: {
    color: "white",
    padding: "5%",
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    fontSize: 14,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
    marginBottom: "4%",
  },
  dropdown: {
    width: "50%",
    padding: "2%",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
  },
  placeholderStyle: {
    padding: "5%",
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    padding: "5%",
    fontSize: 14,
    color: "white",
  },
  dropdownItem: {
    padding: "4%",
    fontSize: 14,
    color: "black",
  },
  dropdownContainer: {
    marginBottom: "4%",
  },
});
