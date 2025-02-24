import { View, Text, Pressable, ScrollView, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width;

export function CoachProfile({ userId }: { userId: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.actionButtonContainer}>
        <LinearGradient
          colors={["#FF9500", "#FF5700"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.gradientBorder}
        >
          <Pressable style={styles.button} onPress={() => console.log("Booking a lesson...")}>
            <Text style={styles.buttonText}>Book a Lesson</Text>
          </Pressable>
        </LinearGradient>
      </View>

      <View style={styles.screensContainer}>
        <View style={styles.tabs}>
          {[...Array(4)].map((_, index) => (
            <Pressable key={index} style={[styles.tab, currentIndex === index && styles.activeTab]}>
              <Text style={[styles.tabText, currentIndex === index && styles.activeTabText]}>
                Tab {index + 1}
              </Text>
            </Pressable>
          ))}
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {[...Array(4)].map((_, index) => (
            <View key={index} style={[styles.screen, { width: screenWidth }]}>
              <View style={styles.screenContentContainer}>
                <Text style={styles.screenText}>Screen {index + 1}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e", // Dark modern background
  },
  actionButtonContainer: {
    padding: "5%",
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#1E1E1E", // Darker button for contrast
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  screensContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
  },
  screenContentContainer: {
    margin: "5%",
    borderColor: "#00A8FF", // Sharp electric blue contrast
    borderWidth: 2,
    backgroundColor: "#1E1E1E", // Deep dark gray
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  screenText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    width: "100%",
   
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
  tabText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
