import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function Loading({ size = 40 }) {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -40, // Large bounce height
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
        Animated.timing(bounceValue, {
          toValue: -16, // First small bounce height
          duration: 250,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ])
    ).start();
  }, [bounceValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ translateY: bounceValue }],
          },
          styles.bouncingCircle,
        ]}
      >
        <LinearGradient
          colors={["#0EA8F5", "#692EF8"]}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: size / 2,
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E0E0E",
  },
  bouncingCircle: {
    overflow: "hidden",
  },
});
