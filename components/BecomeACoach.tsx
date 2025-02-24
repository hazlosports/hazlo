import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Button } from "@/components/UI/Button";
import { getAllSports } from "@/services/sportService";
import { useAuth } from "@/context/AuthContext";

// Define CoachForm type
type CoachForm = {
  fullName: string;
  sport: string | null;
  hourlyRate: string;
  experience: string | null;
};

export default function BecomeACoach() {
  const { user } = useAuth();

  // Form state
  const [form, setForm] = useState<CoachForm>({
    fullName: "",
    sport: null,
    hourlyRate: "",
    experience: null,
  });

  const [sports, setSports] = useState<{ label: string; value: number }[]>([]);
  const [experienceOptions] = useState<{ label: string; value: string }[]>([
    { label: "Less than one year", value: "less_than_1" },
    { label: "1 - 3 years", value: "1_3" },
    { label: "3 - 5 years", value: "3_5" },
    { label: "5 - 10 years", value: "5_10" },
    { label: "20+ years", value: "20_plus" },
  ]);

  const [loading, setLoading] = useState(true);

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

  const handleChange = (key: keyof CoachForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    if (!form.fullName || !form.sport || !form.hourlyRate || !form.experience) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    console.log("Submitting coach form:", form);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* Full Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="gray"
            value={form.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
          />

          {/* Sport Picker */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={sports}
            labelField="label"
            valueField="value"
            value={form.sport}
            onChange={(item) => handleChange("sport", item.label)}
            placeholder="Select Sport"
          />

          {/* Hourly Rate Input */}
          <TextInput
            style={styles.input}
            placeholder="Hourly Rate (in USD)"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={form.hourlyRate}
            onChangeText={(text) => handleChange("hourlyRate", text)}
          />

          {/* Experience Picker */}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={experienceOptions}
            labelField="label"
            valueField="value"
            value={form.experience}
            onChange={(item) => handleChange("experience", item.label)}
            placeholder="Select Experience"
          />

          {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Submit" onPress={onSubmit} />}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
  },
  input: {
    color: "white",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#1e1e1e",
    fontSize: 14,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
  },
  dropdown: {
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "white",
  },
});
 