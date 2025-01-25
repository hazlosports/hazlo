import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/Logo";
import InputField from "@/components/InputField";
import { Button } from "@/components/Button";
import { SportsPicker } from "@/components/SportsPicker";
import { Dropdown } from "react-native-element-dropdown";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

// Define the type for sports data items
type SportItem = {
  id: string;
  name: string;
  imagestring: string;
};

async function getData(): Promise<{
  success: boolean;
  data?: SportItem[];
  msg?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("sports")
      .select("id, name, imagestring");

    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data: data as SportItem[] };
  } catch (error: any) {
    console.log("Warning Error: ", error);
    return { success: false, msg: error.message };
  }
}

const skillLevelsOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
];

export default function OnBoarding() {
  const { user, setAuth } = useAuth();

  const [data, setData] = useState<SportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("sportSelection");
  const [form, setForm] = useState({ username: "" });
  const [selectedSports, setSelectedSports] = useState<SportItem[]>([]);
  const [skillLevels, setSkillLevels] = useState<{ [sportId: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData();
      if (res.success && res.data) setData(res.data);
    };
    fetchData();
  }, []);

  const handleSelectSports = useCallback((selectedItems: SportItem[]) => {
    setSelectedSports(selectedItems);
  }, []);

  const handleButtonPress = async () => {
    setLoading(true);
    try {
      if (screen === "sportSelection") {
        if (!form.username) {
          Alert.alert("Error", "Please fill out the username field.");
          return;
        } else if (selectedSports.length < 1) {
          Alert.alert("Error", "Choose at least one sport.");
          return;
        } else {
          const { error } = await supabase
            .from("users")
            .update({ username: form.username })
            .eq("id", user?.id);

          if (error) {
            Alert.alert("Error", "Username is already taken or invalid.");
            console.log("Error: ", error);
          } else {
            setScreen("skillLevelSelection");
          }
        }
      } else if (screen === "skillLevelSelection") {
        const unselectedLevels = selectedSports.some(
          (sport) => !skillLevels[sport.id]
        );
        if (unselectedLevels) {
          Alert.alert("Error", "Please select a skill level for each sport.");
          return;
        }
        const skillLevelData = selectedSports.map((sport) => ({
          userid: user?.id,
          sportid: sport.id,
          level: skillLevels[sport.id],
        }));

        const { error } = await supabase
          .from("usersports")
          .insert(skillLevelData);

        if (error) {
          Alert.alert(
            "Error",
            "Failed to save your skill levels. Please try again."
          );
          console.log("Error: ", error);
        } else {
          router.replace("/(root)/(tabs)/home");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillLevelChange = (sportId: string, level: string) => {
    setSkillLevels((prev) => ({ ...prev, [sportId]: level }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle={"light-content"} />
        <Logo containerStyle={{ height: "10%" }} />

        {screen === "sportSelection" ? (
          <View style={styles.children}>
            <View style={styles.welcome}>
              <Text style={styles.welcomeHeader}>Finish your account</Text>
              <Text style={styles.welcomeSubHeader}>Step 1 of 2</Text>
            </View>
            <InputField
              label="Username"
              placeholder="johndoe"
              value={form.username}
              onChangeText={(value) => setForm({ ...form, username: value })}
              autoCapitalize="none"
            />
            <SportsPicker data={data} onSelectSports={handleSelectSports} />
            <Button
              title="Continue"
              loading={loading}
              onPress={handleButtonPress}
            />
          </View>
        ) : (
          <View style={styles.children}>
            <View style={styles.welcome}>
              <Text style={styles.welcomeHeader}>Finish your account</Text>
              <Text style={styles.welcomeSubHeader}>Step 2 of 2</Text>
            </View>
            <Text style={styles.title}>Select your skill level</Text>
            {selectedSports.map((sport) => (
              <View key={sport.id} style={styles.skillLevelContainer}>
                <View style={styles.skillLevelText}>
                  <Image
                    source={{ uri: sport.imagestring }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.sportName}>{sport.name}</Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  containerStyle={styles.dropdownContainer}
                  itemContainerStyle={styles.dropdownItem}
                  itemTextStyle={styles.dropdownItem}
                  data={skillLevelsOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select level"
                  value={skillLevels[sport.id]}
                  onChange={(item) =>
                    handleSkillLevelChange(sport.id, item.value)
                  }
                />
              </View>
            ))}
            <View style={styles.buttonGroup}>
              <Button
                title="Back"
                onPress={() => setScreen("sportSelection")}
                variant="outline"
              />
              <Button title="Submit" onPress={handleButtonPress} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 40,
    flexGrow: 1,
  },
  children: {
    gap: 20,
  },
  welcome: {
    gap: 15,
  },
  welcomeHeader: {
    color: "white",
    fontSize: 24,
    fontFamily: "Montserrat-ExtraBold",
  },
  welcomeSubHeader: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  skillLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skillLevelText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sportName: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    textTransform: "capitalize",
  },
  dropdown: {
    width: 150,
    height: 40,
    backgroundColor: "#21242A",
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownContainer: {
    backgroundColor: "#21242A",
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  dropdownItem: {
    backgroundColor: "#21242A",
    color: "white",
    fontSize: 14,
  },
  selectedTextStyle: {
    color: "white",
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#888",
    fontSize: 14,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "white",
    marginTop: 10,
  },
  buttonGroup: {
    marginVertical: 20,
    marginBottom: 50,
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
});
