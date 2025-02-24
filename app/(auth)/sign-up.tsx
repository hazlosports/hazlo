import { View, Text, StatusBar, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/UI/Logo";
import InputField from "@/components/UI/InputField";
import { Button } from "@/components/UI/Button";
import { OAuth } from "@/components/OAuth";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    let username = form.username.trim();
    let email = form.email.trim();
    let password = form.password.trim();

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Sign Up Error",
        error.message || "An unknown error occurred"
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <Logo containerStyle={{ height: "10%" }} />
      <View style={styles.children}>
        {/* Header */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeHeader}>Set Up Your Account</Text>
          <Text style={styles.welcomeSubHeader}>
            Hello! Glad to have you here
          </Text>
        </View>
        {/* Fields */}
        <InputField
          label="Username"
          placeholder="JohnDoe"
          value={form.username}
          onChangeText={(value) => setForm({ ...form, username: value })}
        />
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
        {/* Button */}
        <View style={{ marginTop: 10 }}>
          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
          />
        </View>
        {/* OAuth */}
        <OAuth />
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "white" }]}>
            Already have an account?
          </Text>
          <Link href={"/sign-in"}>
            <Text style={[styles.footerText, { color: "#692EF8" }]}>
              Sign In
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
    gap: 20,
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
  footer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    alignItems: "center",
    marginHorizontal: "auto",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Montserrat-SembiBold",
  },
});
