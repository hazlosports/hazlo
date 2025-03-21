import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { getAllSports, getSportImageSource } from "@/services/sportService"; // Import your service
import { Button } from "@/components/UI/Button";
import { Dropdown } from "react-native-element-dropdown";
import { setUserSport } from "@/services/sportService";
import { useAuth } from "@/context/AuthContext";
import {router} from  'expo-router';

type SportItem = {
  id: string;
  name: string;
  imagestring: string;
};

const skillLevelsOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
];

export function SportsPicker () {


  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("sportSelection");
  const [sportsData, setSportsData] = useState<SportItem[]>([]); // State to hold sports data
  const [selectedSports, setSelectedSports] = useState<SportItem[]>([]); // Selected sports state
  const [skillLevels, setSkillLevels] = useState<{ [sportId: string]: string }>({}); // Selected skill levels

  const toggleSportSelection = (sport: SportItem) => {
    setSelectedSports((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === sport.id);
      return isSelected
        ? prevSelected.filter((item) => item.id !== sport.id)
        : [
            ...prevSelected,
            { id: sport.id, name: sport.name, imagestring: sport.imagestring },
          ];
    });
  };

  // Fetch sports data when component mounts
  useEffect(() => {
    const fetchSports = async () => {
      const response = await getAllSports(); // Fetch sports using the service
      if (response.success && response.data) {
        setSportsData(response.data); // Set the fetched sports data to state
      } else {
        console.error("Failed to fetch sports", response.msg);
      }
    };
    fetchSports();
  }, []);

  const handleSkillLevelChange = (sportId: string, level: string) => {
    setSkillLevels((previousLevels) => ({ ...previousLevels, [sportId]: level }));
  };

  const handleContinue = async () => {
    // Ensure the user ID exists before making any API calls
    if (!user?.id) {
      Alert.alert("Error", "User ID is missing. Please try again.");
      return;
    }

    setLoading(true);

    try {

      if (screen === "sportSelection") {
        if (selectedSports.length < 1) {
          Alert.alert("Error", "Choose at least one sport.");
          return;
        }
        setScreen("skillLevelSelection");
      } else if (screen === "skillLevelSelection") {
        const allSportsHaveLevels = selectedSports.every(
          (sport) => skillLevels[sport.id] !== undefined
        );

        if (!allSportsHaveLevels) {
          Alert.alert("Error", "Please select a skill level for each sport.");
          return;
        }


        const updatePromises = selectedSports.map((sport) => {
          const sportId = parseInt(sport.id, 10); // Ensure it's a number
          const skillLevel = skillLevels[sport.id] ?? "beginner"; 

          if (!user?.id) {
            Alert.alert("Error", "User ID is missing. Please try again.");
            return;
          }
          return setUserSport(user.id, sportId, skillLevel);
        });

        const results = await Promise.all(updatePromises);

        const hasErrors = results.some((res) => res?.success !== true); // Check if 'res' is undefined or doesn't have 'success' as true
        
        if (hasErrors) {
          Alert.alert("Error", "Failed to save your sports interests. Please try again.");
          return;
        }
        Alert.alert("Nice", "Your sports interests have been updated.");
        
        router.dismiss();
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating your profile.");
      console.log("Unexpected Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const renderItem = ({ item }: { item: SportItem }) => {
    const isSelected = selectedSports.some((selected) => selected.id === item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.gridItem}
        onPress={() => toggleSportSelection(item)}
      >
        <LinearGradient
          colors={isSelected ? ["#692EF8", "#0EA8F5"] : ["#0e0e0e", "#0e0e0e"]} // Apply gradient only when selected
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={[styles.gradientBorder]} // Gradient visible when selected
        >
          <View style={styles.itemContainer}>
            <Image
              source={getSportImageSource(item.imagestring)} // Use the sport image here
              style={styles.sportImage}
              resizeMode="contain"
            />
            <Text style={[styles.dashboardText, isSelected ? styles.selectedText : {}]}>
              {item.name}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style= {styles.container}>
      <View>
        <Text style={styles.title}>{screen === "sportSelection" ? "Select your interests" : "Select your skill level"} </Text>
        <Text style={styles.stepHeader}>Step {screen === "sportSelection" ? 1 : 2} of 2</Text>
      </View>
      <View style= {styles.container}>
      {screen === "sportSelection" ? (
        <View  style= {styles.screenContainer}>
          <FlatList
            data={sportsData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3} // 3 items per row
            contentContainerStyle={styles.grid} // Styling for the grid container
          />
          <Button title="Continue" loading={loading} onPress={handleContinue} />
        </View>
      ) : (  
        <View style= {styles.screenContainer} >
          {selectedSports.map((sport) => (
            <View key={sport.id} style={styles.skillLevelContainer}>
              <View style={styles.skillLevelText}>
                <Image
                  source={getSportImageSource(sport.imagestring)}
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
                activeColor="transparent"
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
            <Button title="Back" onPress={() => setScreen("sportSelection")} variant={"outline"} />
          </View>

          <Button title="Continue" loading={loading} onPress={handleContinue} />

        </View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container : {
    flex : 1,
    justifyContent : "space-between",
  },
  screenContainer : {
    flex : 1,
    justifyContent : "space-between",
  },
  title: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "white",
  },
  stepHeader: {
    color: "white",
    fontSize: 12,
    padding  : "5%",

    fontFamily: "Montserrat-Regular",
  },
  grid: {
    justifyContent: "space-between", // Ensure even spacing between grid items
  },
  gridItem: {
    flex: 1, 
    maxWidth: "30%", // Ensure 3 items per row
    margin: 5,
  },
  itemContainer: {
    backgroundColor: "#0E0E0E", // Dark gray background for the button
    justifyContent: "center", // Center the content
    alignItems: "center",
    borderRadius: 12, // Matches the border radius of the wrapper
  },
  gradientBorder: {
    borderRadius: 12, // Matches the button's outer corner radius
    padding: "1%", // Thinner padding for the border effect
  },
  sportImage: {
    width: 50, // Adjust the size of the image
    height: 50, // Adjust the size of the image
    borderRadius: 8,
    margin: "10%", // Slight rounding of the image for a smoother look
  },
  dashboardText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    margin: "10%",
  },
  selectedText: {
    color: "white", // Ensure the selected text has a visible color on the gradient background
  },
  skillLevelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop : "5%"
  },
  skillLevelText: {
    flexDirection: "row",
    alignItems: "center",
  },
  sportName: {
    marginLeft: 10,
    fontFamily: "Montserrat-Regular",
    color: "white",
    fontSize: 16,
  },
  dropdown: {
    width: "50%",
    height: 40,
    backgroundColor: "#1C1C1C",
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
  dropdownContainer: {
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
  },
  dropdownItem: {
    color : "white",
    backgroundColor: "#1C1C1C", 
    marginHorizontal : "5%",
  },
  dropdownItemText :{

  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
