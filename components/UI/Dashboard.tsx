// DashboardSection.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
 // Or any relevant import for IconName type

export interface DashboardItem {
    icon: keyof typeof Feather.glyphMap;
    label: string;
}

interface DashboardProps {
  items: DashboardItem[];
}

const Dashboard = ({ items }: DashboardProps) => {
  return (
    <View style={styles.dashboardContainer}>
     
      {items.map((item, index) => (
        <TouchableOpacity key={index} style={styles.dashboardButtonWrapper}>
          <LinearGradient
            colors={["#692EF8", "#0EA8F5"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.gradientBorder}
          >
            <TouchableOpacity style={styles.dashboardButton}>
              <Feather name={item.icon} size={28} color="white" />
              <Text style={styles.dashboardText}>{item.label}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({

dashboardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding : "5%"
  },
  
  dashboardButtonWrapper: {
    flex: .3, // Ensures the wrapper takes up 1/3 of the space
    aspectRatio: 1.1   , // Maintains a square aspect ratio for the wrapper
    justifyContent: "center",
    alignItems: "center",
    padding: 1, // Reduced padding for a thinner border
    borderRadius: 12,
  },
  
  dashboardButton: {
    flex: 1, // Takes the full space of the wrapper (to maintain square)
    backgroundColor: "#333", // Dark gray background for the button
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 12, // Matches the border radius of the wrapper
  },
  
  gradientBorder: {
    ...StyleSheet.absoluteFillObject, // Ensures gradient is on the outer border
    borderRadius: 12, // Matches the button's outer corner radius
    padding: "1%", // Thinner padding for the border effect
  },
  
  dashboardText: {
    color: "white",
    fontSize: 12,
  }, 
});

export default Dashboard;
