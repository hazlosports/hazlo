import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

type UserMarkerProps = {
  coordinate: { latitude: number; longitude: number };
};

const UserMarker = ({ coordinate }: UserMarkerProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View>
      {/* User Marker */}
      <Marker
        coordinate={coordinate}
        pinColor="blue" // Make the user marker visually distinct
        onPress={() => setShowOptions(!showOptions)}
      />

      {/* Action Panel */}
      {showOptions && (
        <View style={styles.panel}>
          <Text style={styles.panelText}>User Location</Text>
          <Pressable style={styles.button} onPress={() => setShowOptions(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 50,
    left: -40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  panelText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    marginTop: 5,
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserMarker;
