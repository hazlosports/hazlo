import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function CustomDrawer({ navigation }: DrawerContentComponentProps) {
  return (
    <View style={styles.container}>
      <Text onPress={() => navigation.navigate("home")}>Home</Text>
      <Text onPress={() => navigation.navigate("search")}>Search</Text>
      <Text onPress={() => navigation.navigate("hazlo")}>Hazlo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 20,
    backgroundColor: "#0f0f0f",
  },
});
