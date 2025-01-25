import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  bg: string;
  style: StyleProp<ViewStyle>;
}

export function ScreenWrapper({ children, bg, style }: ScreenWrapperProps) {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={[{ flex: 1, paddingTop, backgroundColor: bg }, style]}>
      {children}
    </View>
  );
}
