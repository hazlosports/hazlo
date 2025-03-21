import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MonthlySchedule from "./MonthlySchedule";
import AvailableTimes from "./AvailableDates";
import { Button } from "./UI/Button";

export default function BookLesson() {
  const router = useRouter();

  const [view, setView] = useState<"default" | "calendar" | "times">("default");
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const coach = {
    name: "John Doe",
    sport: "Soccer",
    hourlyRate: "$50/hr",
    avatar: "https://example.com/avatar.jpg",
    description: "Experienced soccer coach with a passion for teaching.",
  };

  // Handles date selection
  const handleDateSelect = (day: number, month: number, year: number) => {
    setSelectedDate({ day, month, year });
    setView("times"); // Show available times
  };

  // Handles time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setView("default"); // Return to default view after selecting time
  };

  const onSubmit = async () => {
    router.dismiss()
  }
  // Generate the text for the "Check availability" button
  const availabilityText = selectedDate && selectedTime
    ? `Selected date: ${selectedDate.day} ${selectedDate.month}, at ${selectedTime}`
    : "Check availability";


  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Image source={{ uri: coach.avatar }} style={styles.avatar} />
        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>{coach.name}</Text>
          <Text style={styles.coachSport}>{coach.sport}</Text>
        </View>
      </View>

      {/* Mid Container */}
      <View style={styles.midContainer}>
        <Text style={styles.description}>{coach.description}</Text>
        <View style={styles.rateContainer}>
          <Text style={styles.rateTitle}>Hourly Rate: </Text>
          <View style={styles.rateBox}>
            <Text style={styles.coachRate}>{coach.hourlyRate}</Text>
          </View>
        </View>
      </View>

      {/* Navigation Logic */}
      <TouchableOpacity
        style={styles.selectDateButton}
        onPress={() => (setView("calendar"))}
      >
        <Text style={styles.selectDateButtonText}>{availabilityText}</Text>
      </TouchableOpacity>

      {view === "calendar" && <MonthlySchedule onDateSelect={handleDateSelect} />}

      {view === "times" && selectedDate && (
        <AvailableTimes
          date={selectedDate}
          coachId="0"
          onBack={() => setView("calendar")}
          onSelectTime={handleTimeSelect}
        />
      )}

      <Button title="Book Lesson" variant = {"coach"} size={"xl"} onPress={onSubmit}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    paddingBottom : "10%",
    justifyContent : "space-between"
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "5%",
  },
  avatar: {
    width: "15%",
    aspectRatio: 1,
    borderRadius: 9999,
  },
  coachInfo: {
    flex: 1,
    paddingLeft: "5%",
  },
  coachName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  coachSport: {
    fontSize: 14,
    color: "gray",
  },
  rateContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  rateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  rateBox: {
    padding: "2%",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "orange",
  },
  coachRate: {
    fontSize: 16,
    color: "orange",
  },
  midContainer: {
    paddingBottom: "5%",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "justify",
    paddingVertical: "5%",
  },
  selectDateButton: {
    borderColor: "orange",
    borderWidth: 1,
    paddingVertical: "3%",
    paddingHorizontal: "6%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  selectDateButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  selectedTimeContainer: {
    backgroundColor: "rgba(255, 165, 0, 0.2)", // Soft orange background
    padding: "5%",
    borderRadius: 12, // Rounded corners
    marginTop: "5%",
    borderWidth: 1,
    borderColor: "orange",
    justifyContent: "center",
  },
  timeContainer: {},
  selectedTimeText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    textAlign: "center", // Aligns text within the container
  },
  dateText: {
    fontSize: 18,
    color: "orange",
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
  },
});
