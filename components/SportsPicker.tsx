import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";

type SportItem = {
  id: string;
  name: string;
  imagestring: string;
};

interface SportsPickerProps {
  data: SportItem[];
  onSelectSports: (selectedItems: SportItem[]) => void;
}

export function SportsPicker({ data, onSelectSports }: SportsPickerProps) {
  const [selectedSports, setSelectedSports] = useState<SportItem[]>([]);

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

  // Use effect to call onSelectSports only when selectedSports changes
  useEffect(() => {
    onSelectSports(selectedSports);
  }, [selectedSports, onSelectSports]);

  return (
    <View>
      <Text style={styles.title}>Select your interests</Text>
      <View style={styles.grid}>
        {data.map((sport) => {
          const isSelected = selectedSports.some(
            (item) => item.id === sport.id
          );
          return (
            <TouchableOpacity
              key={sport.id}
              style={[styles.gridItem]}
              onPress={() => toggleSportSelection(sport)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={["#0EA8F5", "#692EF8"]}
                  style={styles.imageOverlay}
                >
                  <Image
                    source={{ uri: sport.imagestring }}
                    style={[styles.image, styles.imageWithGradient]}
                    resizeMode="contain"
                  />
                </LinearGradient>
              ) : (
                <Image
                  source={{ uri: sport.imagestring }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              <Text style={[styles.sportName]}>{sport.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "white",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "22%",
    margin: "1%",
    padding: 5,
    alignItems: "center",
    flexDirection: "column",
    gap: 5,
    borderRadius: 5,
    marginTop: 15,
  },
  sportName: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "white",
    textTransform: "capitalize",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  imageWithGradient: {
    opacity: 0.8,
  },
  imageOverlay: {
    borderRadius: 5,
    padding: 5,
  },
});
