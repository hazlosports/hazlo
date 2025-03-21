import { View, Text, Pressable, Dimensions, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Video } from "expo-av";
import Packs from "./Packs";
import { getEventsByHost, HazloEvent} from "@/services/eventService";
import EventCard from "./EventCard";

const screenWidth = Dimensions.get("window").width;

export function CoachProfile({ userId }: { userId: string }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState([
    { id: "1", url: "https://www.example.com/video1.mp4" },
    { id: "2", url: "https://www.example.com/video2.mp4" },
    { id: "3", url: "https://www.example.com/video3.mp4" },
  ]);

  const [events, setEvents] = useState<HazloEvent[]>([]);

  const latestVideoUrl = videos.length > 0 ? videos[0].url : "";

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEventsByHost(userId);
      if (!fetchedEvents?.data) return; // Ensure there is data
      setEvents(fetchedEvents.data); // Set only the 'data' array
    } catch (error) {
      console.error("Error fetching events:", error);
      // Optionally show an alert or error state here
    }
  };

  fetchEvents();
}, [userId]);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["Home", "Events", "Media", "Packs", "More"].map((label, index) => (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => setCurrentIndex(index)}
          >
            {currentIndex === index ? (
              <Text style={[styles.tabText, styles.activeTabText]}>{label}</Text>
            ) : (
              <Text style={styles.tabText}>{label}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Screens */}
      <View style={[styles.screen, { width: screenWidth }]}>
        {currentIndex === 0 && (
          <>
          {/* Book Lesson Button */}
      <View style={styles.actionButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.bookLessonButton,
            pressed && styles.bookLessonButtonPressed,
          ]}
          onPress={() => router.navigate("/actionScreen?component=bookLesson")}
        >
          <LinearGradient
            colors={["#FF9500", "#FF5700"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.bookLessonGradient}
          >
            <Text style={styles.bookLessonText}>Book Lesson</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.bookLessonButton,
            pressed && styles.bookLessonButtonPressed,
          ]}
          onPress={() => router.navigate("/actionScreen?component=bookLesson")}
        >
          <LinearGradient
            colors={["#FF9500", "#FF5700"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.bookLessonGradient}
          >
            <Text style={styles.bookLessonText}>share</Text>
          </LinearGradient>
        </Pressable>
      </View>
            {/* Latest Event Card */}
            <Text style={styles.mediaTitle}> Upcoming events</Text>
            {events.length > 0 && <EventCard event={events[0]} />}

            {/* Packs Section */}
            <Text style={styles.mediaTitle}>Packs</Text>
            <Packs coachId={userId} horizontal={true} />

            {/* Latest Media */}
            <View style={styles.mediaContainer}>
              <View style={styles.mediaHeader}>
                <Text style={styles.mediaTitle}>Latest Media</Text>
                <Pressable onPress={() => router.push("/")}>
                  <Text style={styles.showMoreText}>Show More</Text>
                </Pressable>
              </View>
              <View style={styles.videoWrapper}>
                <Video
                  source={{ uri: latestVideoUrl }}
                  style={styles.video}
                  useNativeControls
                  isLooping={false}
                />
              </View>
            </View>
          </>
        )}

        {currentIndex === 2 && (
          <>
            {/* Latest Media */}
            <View style={styles.mediaContainer}>
              <View style={styles.mediaHeader}>
                <Text style={styles.mediaTitle}>Latest Media</Text>
              </View>
              <View style={styles.videoWrapper}>
                <Video
                  source={{ uri: latestVideoUrl }}
                  style={styles.video}
                  useNativeControls
                  isLooping={false}
                />
              </View>
            </View>

            {/* All Videos - Paginated List */}
            <FlatList
              data={videos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.videoWrapper}>
                  <Video
                    source={{ uri: item.url }}
                    style={styles.video}
                    useNativeControls
                    isLooping={false}
                  />
                </View>
              )}
            />
          </>
        )}

        {currentIndex === 3 && (
          <>
            {/* Packs in Vertical Mode */}
            <Packs coachId={userId} horizontal={false} />
          </>
        )}

          {currentIndex === 1 && (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id ?? ''}
              renderItem={({ item }) => <EventCard event={item} />}
            />
          )}
        {currentIndex === 4 && <Text style={styles.screenText}>Screen {currentIndex + 1}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor  : "#0e0e0e",

  },
  actionButtonContainer: {
    flexDirection : "row",
    padding: "5%",
    justifyContent: "space-evenly"
  },
  bookLessonButton: {
    overflow: "hidden",
  },  
  bookLessonButtonPressed: {
    opacity: 0.8,
  },
  bookLessonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5%",
  },
  bookLessonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 0.8,
  },
  /* Media Section */
  mediaContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  mediaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mediaTitle: {
    color: "#FFF",
    paddingHorizontal: "2%",
    fontSize: 20,
    fontWeight: "400",
  },
  showMoreText: {
    color: "#FF9500",
    fontSize: 14,
    fontWeight: "500",
  },
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  /* Screens Section */
  screensContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabGradient: {
    flex: 1,
    width: "100%",
    padding: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "300",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "400",
    borderBottomWidth: 2,
    borderBottomColor: "#FFBD55",
  },
});

export default CoachProfile;
