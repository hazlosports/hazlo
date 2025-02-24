import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

interface LogoProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export function Logo({ containerStyle }: LogoProps) {
  return (
    <View style={[styles.logoContainer, containerStyle]}>
      <Text style={styles.logo}>HAZLO</Text>
      <View style={styles.circleContainer}>
        <LinearGradient colors={["#0EA8F5", "#692EF8"]} style={styles.circle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logo: {
    fontSize: 50,
    fontFamily: "Montserrat-ExtraBold",
    color: "white",
  },
  circleContainer: {
    marginLeft: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
    position: "relative",
    bottom: -11,
  },
  circle: {
    width: "100%",
    height: "100%",
    borderRadius: 7,
  },
});
