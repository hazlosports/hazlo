import { StyleSheet, StatusBar, View, Pressable, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/UI/Logo";
import { Button } from "@/components/UI/Button";
import { router } from "expo-router";

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Logo />
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.replace("/(auth)/sign-up")}
          size="xl"
        />
        <View>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={styles.footerText}>Log In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0E0E0E",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: "5%",
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  footerText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
  },
});
