import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

// Helper function to get the number of days in a specific month
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const MonthlySchedule = ({ onDateSelect }: { onDateSelect: (day: number, month: number, year: number) => void }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null);

  const today = new Date();

  // Get screen width
  const screenWidth = Dimensions.get('window').width;
  const paddedWidth = screenWidth * 0.8; 
  const dayButtonWidth = paddedWidth / 7.1;
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null); // Reset selection when changing months
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null); // Reset selection when changing months
  };

  const handleDatePress = (day: number) => {
    setSelectedDate({ day, month: currentMonth, year: currentYear });
    onDateSelect(day, currentMonth, currentYear); // Pass selected date to parent component
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7;

  return (
    <View style={[styles.container, { width: paddedWidth }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {months[currentMonth]} {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Days of the week header */}
      <View style={styles.weekdays}>
        {["S", "M", "T", "W", "Th", "F", "S"].map((day) => (
          <Text key={day} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {/* Empty spaces before the 1st day of the month */}
        {[...Array(startDay)].map((_, i) => (
          <View key={i} style={[styles.emptyDay, { width: dayButtonWidth }]}></View>
        ))}

        {/* Render the actual days */}
        {[...Array(daysInMonth)].map((_, i) => {
          const date = i + 1;
          const isToday = 
            date === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear();
          
          const isSelected = 
            selectedDate?.day === date &&
            selectedDate?.month === currentMonth &&
            selectedDate?.year === currentYear;

          return (
            <TouchableOpacity 
              key={date} 
              style={[styles.dateButton, 
                isToday && styles.today, 
                isSelected && styles.selectedDate,
                { width: dayButtonWidth }
              ]}
              onPress={() => handleDatePress(date)}
            >
              <Text 
                style={[styles.dateText, 
                  isToday && styles.todayText,
                  isSelected && styles.selectedDateText
                ]}
              >
                {date}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Empty spaces after the last day of the month to complete the 7-column grid */}
        {[...Array(totalCells - daysInMonth - startDay)].map((_, i) => (
          <View key={i + daysInMonth} style={[styles.emptyDay, { width: dayButtonWidth }]}></View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "orange",
    backgroundColor: "rgba(255,255,255,0.01)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    color: "white",
    fontSize: 24,
  },
  monthYear: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekdayText: {
    color: "white",
    fontSize: 14,
    fontWeight : 100,
    textAlign: "center",
    width: "14%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptyDay: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: "3%",
  },
  today: {
    backgroundColor: "#BB86FC",
  },
  todayText: {
    fontWeight: "bold",
    color: "#121212",
  },
  dateText: {
    color: "white",
  },
  selectedDate: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "orange",
  },
  selectedDateText: {
    fontWeight: "bold",
  },
});

export default MonthlySchedule;
