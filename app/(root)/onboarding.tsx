import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "@/components/UI/Logo";
import InputField from "@/components/UI/InputField";
import { Button } from "@/components/UI/Button";
import { useAuth } from "@/context/AuthContext";
import { updateUser } from "@/services/userService";
import { useRouter } from "expo-router";

export default function userRoleSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [form, setForm] = useState({
    name: "",
    biography: "",
    location: "",
  });

  const router = useRouter();

  const handleButtonPress = async () => {
    console.log("pressed button");

    if (!user?.id) {
      Alert.alert("Error", "User ID is missing. Please try again.");
      return;
    }

    if (currentPage === 0 && !form.name) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    if (currentPage === 1 && !form.biography) {
      Alert.alert("Error", "Please enter a short biography.");
      return;
    }

    if (currentPage === 2 && !form.location) {
      Alert.alert("Error", "Please enter your location.");
      return;
    }

    // On the final screen, submit the data
    if (currentPage === 3) {
      setLoading(true);
      try {
        const response = await updateUser(user.id, form);
        if (!response.success) {
          Alert.alert("Error", "Something went wrong while updating your profile.");
          console.log("Error:", response.msg);
          return;
        }
        router.replace('./rolePicker');
      } catch (error) {
        Alert.alert("Error", "An error occurred while updating your profile.");
        console.log("Unexpected Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSkip = () => {
    if (currentPage < 3 || currentPage === 1 ) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={"light-content"} />
      <Logo containerStyle={{ height: "10%" }} />
      <View style={styles.container}>
        <View>
          <Text style={styles.welcomeHeader}>Finish your account</Text>
          {currentPage != 3 && (
          <Text style={styles.welcomeSubHeader}>Step {currentPage + 1} of 3</Text>
        )}
        </View>
        <View style={styles.screenContainer}>
          <View style={styles.promptScreenContainer}>
            {currentPage === 0 && (
              <InputField
                label="Name"
                placeholder="John Doe"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
                autoCapitalize="words"
                style={styles.inputField}
              />
            )}
            {currentPage === 1 && (
              <View style={{ width: "100%" }}>
                <InputField
                  label="Biography"
                  placeholder="Tell us about yourself"
                  value={form.biography}
                  onChangeText={(value) => {
                    if (value.length <= 120) {
                      setForm({ ...form, biography: value });
                    }
                  }}
                  autoCapitalize="sentences"
                  multiline={true}
                  textAlignVertical="top"
                  style={styles.inputField}
                />
                <Text style={styles.subLabel}>Maximum 120 characters</Text>
              </View>
            )}
            {currentPage === 2 && (
              <InputField
                label="Location"
                placeholder="Atlanta"
                value={form.location}
                onChangeText={(value) => setForm({ ...form, location: value })}
                autoCapitalize="words"
                style={styles.inputField}
              />
            )}
            {currentPage === 3 && (

              <View style={styles.container}>
              <Text style={styles.reviewHeader}>Review Your Details</Text>

              <View style={styles.reviewContainer}>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewText}>Name:</Text>
                  <Text style={styles.reviewInfoText}>{form.name}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewText}>Biography:</Text>
                  <Text style={styles.reviewInfoText}>{form.biography}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewText}>Location:</Text>
                  <Text style={styles.reviewInfoText}>{form.location}</Text>
                </View>
              </View>
              </View>
            )}
          </View>
        </View>
        <View>
          <Button
            title={currentPage === 3 ? "Finish" : "Continue"}
            loading={loading}
            onPress={handleButtonPress}
            size={"xl"}
          />
          {currentPage < 3 && (
            <TouchableOpacity
              onPress={handleSkip}
              disabled={currentPage === 3}
              style={{ opacity: currentPage === 0 || currentPage === 3 ? 0 : 1 }}
              >
              <Text style={styles.skip}> Skip </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  container: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10%",

  },
  promptScreenContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  welcomeHeader: {
    color: "white",
    fontSize: 24,
    fontFamily: "Montserrat-ExtraBold",
  },
  welcomeSubHeader: {
    color: "#B0B0B0",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  inputField: {
    backgroundColor: "#1E1E1E",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    borderRadius: 10,
    fontSize: 16,
    color: "white",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  subLabel: {
    color: "#B0B0B0",
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    alignSelf: "flex-end",
  },
  skip: {
    color: "#B0B0B0",
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    alignSelf: "center",
    textDecorationLine: "underline",
    padding: "2%",
  },
  reviewContainer: {
    flex :1,
    justifyContent : "space-evenly",
  },
  reviewHeader: {
    fontSize: 18,
    color: "white",
    fontFamily: "Montserrat-ExtraBold",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "visible",
    flexWrap :"wrap",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    padding : "5%"
  },
  reviewText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Montserrat-Semibold",
  },
  reviewInfoText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Montserrat-Regular",
  },
});
