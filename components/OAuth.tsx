import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "./UI/Button";
import { icons } from "@/constants";

export function OAuth() {
  const handleGoogleSignIn = async () => {};
  return (
    <View style={{ gap: 15 }}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.oauth}>
        <Button
          title="Sign In With Google"
          IconLeft={() => (
            <Image
              source={icons.google}
              resizeMode="contain"
              style={{ width: 25, height: 25, marginHorizontal: 8 }}
            />
          )}
          variant="outline"
          onPress={handleGoogleSignIn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "white",
  },
  dividerText: {
    color: "white",
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  oauth: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  oAuthLogo: {
    width: 25,
    height: 25,
  },
});
