import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { HazloEvent } from '@/services/eventService';
import { getSportImageSource } from '@/services/sportService';

type EventCardProps = {
  event: HazloEvent;
};

const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();

  return (
    <View style={styles.eventCardContainer}>
      <View style={styles.eventCard}>
        {/* Banner Section */}
        <View style={styles.eventCardBanner}>
          <Image
            source={require('@/assets/images/defaultBanner.png')}
            style={styles.bannerImage} // Make sure the image fits the banner section
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={styles.eventCardInformation}>
          {/* Left Section - Sport Image + Date */}
          <View style={styles.leftSection}>
            <Image
              source={getSportImageSource("yoga")}
              style={styles.sportImage}
              resizeMode="contain"
            />
            <View style={styles.dateContainer}>
              <Text style={styles.eventDay}>
                {new Date(event.date).toLocaleDateString("en-US", { day: "2-digit" })}
              </Text>
              <Text style={styles.eventMonth}>
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Content Section - Title & Description */}
          <View style={styles.contentSection}>
            <Text style={styles.eventTitle}>{event.name}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </View>

          {/* More Section - Button */}
          <View style={styles.moreSection}>
            <Pressable onPress={() => router.push("/")}>
              <Text style={styles.showMoreText}>more</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCardContainer: {
    padding: "5%",
  },
  eventCard: {
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#0c0c0c",
    backgroundColor: "#1a1a1a",
    justifyContent: "space-between",
    overflow: 'hidden', // Ensures the child elements respect the rounded corners
  },
  eventCardBanner: {
    aspectRatio: 1.6,
    width: '100%',
    overflow: 'hidden', // Ensures the image is clipped to the rounded corners
    borderTopEndRadius: 12, // Apply this if you want the image to be clipped to the rounded corners
  },
  bannerImage: {
    width: '100%',
    height: '100%', // Ensure the image takes the full banner height
    borderTopEndRadius: 12, // Apply this if you want the image to be clipped to the rounded corners
  },
  eventCardInformation: {
    padding: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Left Section - Image + Date
  leftSection: {
    flex: 0.15, // Adjust to fit your design, here it takes 20% of the card width
    alignItems: "center",
  },
  sportImage: {
    width: 50,
    height: 50,
    padding : "20%"
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDay: {
    color: "#FF9500",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 4,
  },
  eventMonth: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },

  // Content Section
  contentSection: {
    flex: 0.6, // Adjust this to take more or less space
    paddingHorizontal: "5%",
    justifyContent: "flex-start",
  },
  eventTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDescription: {
    color: "#FFF",
    fontSize: 12,
    marginBottom: 12,
  },

  // More Section
  moreSection: {
    flex: 0.1, // Adjust this to fit the button properly
  },

  showMoreText: {
    color: "orange",
    fontSize: 10,
    fontWeight: "500",
  },
});

export default EventCard;
