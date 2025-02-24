import React, { useRef, useEffect, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  modifiableYear: boolean;
}

const DatePicker = ({ selectedDate, onDateChange, modifiableYear }: DatePickerProps) => {
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const days = Array.from({ length: 31 }, (_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, index) => ({
    label: (currentYear + index).toString(),
    value: currentYear + index,
  }));

  const availableTimes = [
    { label: "12:00 PM", value: "12:00" },
    { label: "1:00 PM", value: "13:00" },
    { label: "2:00 PM", value: "14:00" },
    { label: "3:00 PM", value: "15:00" },
    { label: "4:00 PM", value: "16:00" },
    { label: "5:00 PM", value: "17:00" },
    { label: "6:00 PM", value: "18:00" },
    { label: "7:00 PM", value: "19:00" },
  ];

  const dayRef = useRef(1);
  const monthRef = useRef(1);
  const yearRef = useRef(currentYear);
  const timeRef = useRef("12:00");

  useEffect(() => {
    const initialDate = new Date(selectedDate);
    dayRef.current = initialDate.getUTCDate();
    monthRef.current = initialDate.getUTCMonth() + 1;
    yearRef.current = modifiableYear ? initialDate.getUTCFullYear() : currentYear;

    const formattedTime = `${initialDate.getUTCHours().toString().padStart(2, "0")}:${initialDate.getUTCMinutes().toString().padStart(2, "0")}`;
    timeRef.current = formattedTime;
  }, [selectedDate, modifiableYear]);

  const handleSaveDate = useCallback(() => {
    const newDate = new Date(Date.UTC(yearRef.current, monthRef.current - 1, dayRef.current));
    const [hours, minutes] = timeRef.current.split(":").map(Number);
    newDate.setUTCHours(hours, minutes);

    onDateChange(newDate.toISOString());
  }, [onDateChange]);

  return (
    <View>
      {/* Date selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Date</Text>
        <View style={styles.row}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            data={days}
            labelField="label"
            valueField="value"
            value={dayRef.current.toString()}
            onChange={(item) => (dayRef.current = item.value)}
            placeholder={dayRef.current.toString()}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            data={months}
            labelField="label"
            valueField="value"
            value={monthRef.current.toString()}
            onChange={(item) => (monthRef.current = item.value)}
            placeholder={monthRef.current.toString()}
          />
          {modifiableYear && (
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholder}
              selectedTextStyle={styles.selectedText}
              data={years}
              labelField="label"
              valueField="value"
              value={yearRef.current.toString()}
              onChange={(item) => (yearRef.current = item.value)}
              placeholder={yearRef.current.toString()}
            />
          )}
        </View>
      </View>

      {/* Time selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Time</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          data={availableTimes}
          labelField="label"
          valueField="value"
          value={timeRef.current}
          onChange={(item) => (timeRef.current = item.value)}
          placeholder={timeRef.current}
        />
      </View>

      {/* Save Date Button */}
      <View style={styles.buttonContainer}>
        <Button title="Save Date" onPress={handleSaveDate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdown: {
    flex: 1,
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    borderColor: "#3D3D3D",
    borderWidth: 0.5,
    marginHorizontal: 2, // Small spacing between items
  },
  placeholder: {
    fontSize: 14,
    color: "gray",
  },
  selectedText: {
    fontSize: 14,
    color: "white",
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default DatePicker;
