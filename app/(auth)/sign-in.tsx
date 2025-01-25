import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/Logo";
import InputField from "@/components/InputField";
import { Button } from "@/components/Button";
import { Link } from "expo-router";
import { OAuth } from "@/components/OAuth";
import { supabase } from "@/lib/supabase";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    let email = form.email.trim();
    let password = form.password.trim();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(
        "Sign In Error",
        error.message || "An unknown error occurred"
      );
    }

    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Logo containerStyle={{ height: "15%" }} />
      <View style={styles.children}>
        {/* Header */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeHeader}>Sign In</Text>
          <Text style={styles.welcomeSubHeader}>Hello! Welcome Back</Text>
        </View>
        {/* Fields */}
        <InputField
          label="Email"
          placeholder="example@example.com"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <InputField
          label="Password"
          placeholder="******"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
        {/* Button */}
        <Button title="Sign In" onPress={handleSignIn} loading={loading} />
        {/* OAuth */}
        <OAuth />
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "white" }]}>
            Don't have an account?
          </Text>
          <Link href={"/sign-up"}>
            <Text style={[styles.footerText, { color: "#692EF8" }]}>
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0E0E0E",
    height: "100%",
    paddingHorizontal: 20,
    gap: 40,
  },
  children: {
    display: "flex",
    gap: 30,
  },
  welcome: {
    gap: 15,
  },
  welcomeHeader: {
    color: "white",
    fontSize: 24,
    fontFamily: "Montserrat-ExtraBold",
  },
  welcomeSubHeader: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  forgotPassword: {
    textAlign: "right",
    fontFamily: "Montserrat-SemiBold",
    color: "white",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Montserrat-SembiBold",
  },
});
