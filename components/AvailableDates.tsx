import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { getLessonsByDate } from "@/services/lessonService";

const AvailableTimes = ({
  date,
  coachId,
  onSelectTime,
  onBack,
}: {
  date: { day: number; month: number; year: number };
  coachId: string;
  onSelectTime: (time: string) => void; // Callback to send time back
  onBack: () => void;
}) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const formattedDate = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      setLoading(true);
      const { success, data } = await getLessonsByDate(formattedDate);

      if (!success || !data) {
        console.error("Failed to fetch lessons");
        setAvailableTimes([]);
        setLoading(false);
        return;
      }

      const bookedTimes = data
        .filter((lesson) => lesson.coach_id === coachId)
        .map((lesson) => lesson.date.split("T")[1].slice(0, 5));

      const allTimeSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
      ];

      setAvailableTimes(allTimeSlots.filter((time) => !bookedTimes.includes(time)));
      setLoading(false);
    };

    fetchAvailableTimes();
  }, [formattedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Times for {formattedDate}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : availableTimes.length > 0 ? (
        <FlatList
          data={availableTimes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.timeSlot} onPress={() => onSelectTime(item)}>
              <Text style={styles.timeText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noSlotsText}>No available slots for this date</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
  },
  header: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: "5%",
  },
  timeSlot: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "6%",
    marginVertical: "2%",
    borderRadius: 8,
    borderColor: "orange",
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
    color: "white",
  },
  noSlotsText: {
    fontSize: 16,
    color: "gray",
    marginTop: "5%",
  },
  backButton: {
    marginTop: "5%",
    borderWidth: 1,
    borderColor: "orange",
    padding: "3%",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default AvailableTimes;
