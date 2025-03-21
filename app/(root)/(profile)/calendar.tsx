import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const CalendarScreen = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Helper function to get the start of the week (Sunday)
  const getStartOfWeek = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    return new Date(date.setDate(diff));
  };

  // Helper function to generate the days for the current week
  const generateDaysOfWeek = (startOfWeekDate: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeekDate);
      day.setDate(startOfWeekDate.getDate() + i);
      return day;
    });
  };

  // Helper function to go to the next week
  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(nextWeekStart);
  };

  // Helper function to go to the previous week
  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prevWeekStart);
  };

  // Generate the days for the current week
  const daysOfWeek = generateDaysOfWeek(getStartOfWeek(currentWeekStart));

  // Set today's date as the default selected day
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setSelectedDay(today);
  }, []);

  // Handle day press and set selected day
  const handleDayPress = (day: Date) => {
    setSelectedDay(day.toISOString().split("T")[0]);
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`); // Hours from 8 AM to 8 PM

  return (
    <View style={styles.container}>
      {/* Calendar Header with Week Navigation */}
      <View style={styles.weekNav}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <Text style={styles.navButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.weekText}>
          {daysOfWeek[0].toLocaleString("en-US", { month: "long" })}
        </Text>
        <TouchableOpacity onPress={goToNextWeek}>
          <Text style={styles.navButton}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.daysHeader}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.dayHeaderText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid for Current Week */}
      <View style={styles.daysGrid}>
        {daysOfWeek.map((day, index) => {
          const isSelected = day.toISOString().split("T")[0] === selectedDay;
          const isToday = day.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, isSelected && styles.selectedDay, isToday && styles.todayDay]}
              onPress={() => handleDayPress(day)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText, isToday && styles.todayDayText]}>
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Daily Schedule for Selected Day */}
      <View style={styles.scheduleContainer}>
        <FlatList
          data={hours}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.scheduleItem}>
              <Text style={styles.timeText}>{item}</Text>
              <TouchableOpacity style={styles.emptySlot}>
                <Text style={styles.slotText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    padding: "2%",
  },
  weekNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
  },
  navButton: {
    fontSize: 24,
    color: "orange",
  },
  weekText: {
    fontSize: 20,
    fontWeight: 200,
    color : "white"
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "3%"
  },
  dayHeaderText: {
    fontSize: 10,
    fontWeight: "100",
    textAlign: "center",
    color : "white",
    paddingHorizontal: "3%",

  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayButton: {
    aspectRatio  : 1,
    padding: "3%",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#fff",
    margin : "1%"
  },
  selectedDay: {
    backgroundColor: "orange",
    borderRadius: "100%"
  },
  selectedDayText: {
    color: "#fff",
  },
  todayDay: {
    borderColor: "orange",
    borderWidth: .5,
    borderRadius: 6,
  },
  todayDayText: {
    color: "white",
  },
  scheduleContainer: {
    marginTop: "3%",
    flex: 1,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  timeText: {
    fontSize: 16,
    color: "#fff",
    width: 60,
  },
  emptySlot: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  slotText: {
    color: "white",
    fontSize: 18,
  },
});

export default CalendarScreen;
