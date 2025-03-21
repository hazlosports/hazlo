import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

// Define the props type
type DailyScheduleProps = {
  selectedDate: string;
};

const DailySchedule = ({ selectedDate }: DailyScheduleProps) => {
  const handleHourPress = (hour: number) => {
    // Functionality for selecting a time slot
    console.log(`Hour selected: ${hour}`);
  };

  // Create an array of hours
  const hours = [...Array(24)].map((_, i) => i);

  return (
    <View style={styles.container}>
      <FlatList
        data={hours}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleHourPress(item)}
            style={styles.timeButton}
          >
            <Text style={styles.timeSlot}>
              {item < 10 ? `0${item}` : item}:00
            </Text>

          </TouchableOpacity>
        )}
        contentContainerStyle={styles.scheduleGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scheduleGrid: {
  },
  timeButton: {
    padding : "5%",
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  timeSlot: {
    color: "gray",
    fontSize: 12,
    fontWeight: "300",
  },
});

export default DailySchedule;
