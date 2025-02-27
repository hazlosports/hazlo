import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Loading } from "./Loading";

type ButtonProps = {
  textStyle?: object;
  title?: string;
  IconLeft?: React.ComponentType;
  IconRight?: React.ComponentType;
  variant?: "hazlo" | "user" | "coach" | "club"  | "service" |  "outline" | "destructive";
  size?: "small" | "medium" | "large" | "xl";
  onPress?: () => void;
  loading?: boolean;
};

const getVariant = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "hazlo":
      return ["#0EA8F5", "#692EF8"];
    case "user":
      return ["#2196F3", "#21CBF3"]; // Modern blue gradient
    case "coach":
      return ["#FFBD55", "#FF7009"]; // Modern orange gradient
    case "club":
      return ['#7dfaaf', "#06d43e"];  
    case "service":
      return ['#FF72DC', '#9C00D4']; // Modern green gradient
    case "outline":
      return ["#0E0E0E", "#0E0E0E"];
    case "destructive":
      return ["#FF0000", "#FF0000"];
    default:
      return ["#0EA8F5", "#692EF8"];
  }
};

const getSizeStyles = (size: ButtonProps["size"]) => {
  switch (size) {
    case "small":
      return {
        paddingVertical: 8,
        paddingHorizontal: 20,
        fontSize: 14,
      };
    case "large":
      return {
        paddingVertical: 12,
        paddingHorizontal: 48,
        fontSize: 18,
      };
    case "xl":
      return {
        paddingVertical: 16,
        paddingHorizontal: 100,
        fontSize: 18,
      };
    case "medium":
    default:
      return {
        paddingVertical: 10,
        paddingHorizontal: 32,
        fontSize: 16,
      };
  }
};

export function Button({
  textStyle,
  title = "",
  IconLeft,
  IconRight,
  variant = "hazlo",
  size = "medium",
  onPress = () => {},
  loading = false,
}: ButtonProps) {
  const sizeStyles = getSizeStyles(size);

  if (loading) {
    return (
      <View style={[styles.button, { backgroundColor: "#0E0E0E" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <LinearGradient
        colors={getVariant(variant) as string[]}
        style={[
          styles.button,
          sizeStyles,
          variant === "outline" && {
            borderRadius: 10,
            borderColor: "#D9D9D9",
            borderWidth: 1,
          },
        ]}
      >
        {IconLeft && <IconLeft />}
        <Text
          style={[styles.text, textStyle, { fontSize: sizeStyles.fontSize }]}
        >
          {title}
        </Text>
        {IconRight && <IconRight />}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 16,
  },
  button: {
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontFamily: "Monserrat-SemiBold",
  },
});
