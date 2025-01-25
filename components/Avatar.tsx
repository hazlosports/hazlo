import { ImageStyle, StyleProp, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getUserImageSrc } from "../services/imageService";

interface AvatarProps {
  uri: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function Avatar({ uri, size = 32, style }: AvatarProps) {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: size / 2 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
  },
});
