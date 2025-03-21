import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native"; // Arrow Icon used as bullet point

const adjustedWidth = Dimensions.get("window").width * 0.7;

const PackItem = ({ pack, horizontal }: { pack: any; horizontal?: boolean }) => {
  return (
    <View style={[styles.packContainer, horizontal && styles.horizontalPack]}>
      <LinearGradient
        colors={[ "#FFBD55","#FFEECC",]} // Gold gradient
        style={styles.gradientBorder}
      >
        <View style={styles.panel}>
          {/* Header Section with Gradient */}
          <LinearGradient
            colors={[ "#FFBD55","#FFEECC",]} // Gold gradient
            style={styles.headerGradient}
          >
            <Text style={styles.packName}>{pack.name}</Text>
          </LinearGradient>

          {/* Content Section with Bullet Points (using Check as arrow) */}
          <View style={styles.content}>
            <Text style={styles.subtitle}>Benefits</Text>
            <FlatList
              data={pack.benefits}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.optionRow}>
                  <Check color="#FFBD55" size={20} />
                  <Text style={styles.option}>{item}</Text>
                </View>
              )}
            />

            {/* Price Section */}
            <Text style={styles.price}>${pack.price} /mo</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  packContainer: {
    borderRadius: 12,
    overflow: "hidden", // Ensure the gradient border is visible
    marginBottom: "5%", // Spacing between pack items
    padding: 1, // Padding to help show the gradient border
  },
  horizontalPack: {
    width: adjustedWidth, // Ensures proper alignment in horizontal scroll
    marginRight: "5%", // Adds some spacing between items
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 12, // Border radius for the gradient container
    padding: 1, // Add padding around the content to show the gradient border clearly
  },
  panel: {
    flex: 1,
    backgroundColor: "#1f1f1f", // Ensures panel background is visible behind the gradient border
    borderRadius: 12, // Inner border radius for the panel
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: "5%",
    paddingVertical: "2%",
  },
  packName: {
    fontSize: 22,
    fontWeight: "500", // Bold and sharp for the title
    color: "white",
  },
  content: {
    flex: 0.7,
    padding: "5%",
    position: "relative", // Allows positioning of the price inside the content container
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "2%",
  },
  option: {
    fontSize: 14,
    fontWeight: "200",
    color: "white",
    paddingLeft: "5%",
  },
  price: {
    alignSelf : "flex-end",
    fontSize: 24,
    fontWeight: "400", // Sharp, elegant font weight for the price
    color: "#FFdDbb", // Gold color for the price
  },
});

export default PackItem;
