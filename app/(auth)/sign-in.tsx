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
import { Logo } from "@/components/UI/Logo";
import InputField from "@/components/UI/InputField";
import { Button } from "@/components/UI/Button";
import { Link } from "expo-router";
import { OAuth } from "@/components/OAuth";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService"; // Import the getUserData function
import { router } from "expo-router";

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
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      Alert.alert("Sign In Error", error.message || "An unknown error occurred");
      setLoading(false);
      return;
    }
  
    const user = data.user;
    if (!user) {
      Alert.alert("Error", "Authentication failed. Please try again.");
      setLoading(false);
      return;
    }
  
    // Check if the user has a username
    const userResponse = await getUserData(user.id);
    if (!userResponse.success) {
      Alert.alert("Error", "Failed to retrieve user data.");
      setLoading(false);
      return;
    }
  
    const userData = userResponse.data;
    if (!userData?.userRole) {
      // Redirect to onboarding if the userrole is missing
      router.dismissTo("/(root)/(drawer)/(tabs)/home");
    } else {
      // Redirect to home if the username exists
      router.dismissTo("/(root)/(drawer)/(tabs)/home");
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
