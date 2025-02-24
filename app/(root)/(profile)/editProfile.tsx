import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Pressable
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "@/components/UI/Avatar";
import { Button } from "@/components/UI/Button";
import { uploadFile, getUserImageSrc } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import SportsSection from "@/components/SportSection";

export default function EditProfile() {
  
  const { user: currentUser, setUserData } = useAuth();
  const router = useRouter();  // Use params to get passed values

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    biography: "",
    location: "",
    banner: "",
    avatar: "",
  });

  
  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        username: currentUser.username || "",
        biography: currentUser.biography || "",
        location: currentUser.location || "",
        banner: currentUser.banner || "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]); // Dependency array ensures it runs whenever currentUser changes

  // Function to replace the banner image
  const onPickBannerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required to select a banner image."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        banner: result.assets[0].uri,
      }));
    }
  };

  // Function to replace the profile image
  const onPickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required to select a profile image."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        avatar: result.assets[0].uri,
      }));
    }
  };
    const onSubmit = async () => {
      let userData = { ...user };
      let { name, username, biography, location, banner, avatar } = userData;
    
      const avatarImage = avatar || "";
      const bannerImage = banner || "";
    
      if (!name || !username || !biography || !location || !avatarImage || !bannerImage) {
        Alert.alert("Profile", "Please fill all the fields");
        return;
      }
    
      setLoading(true);
    
      // Handle avatar image upload if it's a new selection
      if (avatarImage && typeof avatarImage === "object") {
        let imageRes = await uploadFile("profilePictures", avatarImage, "avatar");
        if (imageRes.success) {
          userData.avatar = imageRes.data as string;  // Use the uploaded avatar URL
        } else {
          userData.avatar = "";
        }
      }
    
      // Handle banner image upload if it's a new selection
      if (bannerImage && typeof bannerImage === "object") {
        let bannerRes = await uploadFile("profilePictures", bannerImage, "banner");
        if (bannerRes.success) {
          userData.banner = bannerRes.data as string;  // Use the uploaded banner URL
        } else {
          userData.banner = "";
        }
      }
    
      userData.avatar = avatarImage;
      userData.banner = bannerImage;
    
      // Now update the user data in the database
      const res = await updateUser(currentUser?.id as string, userData);
      setLoading(false);
    
      if (res.success) {
        setUserData({ ...currentUser, ...userData });  // Update local user data
        router.replace("/profile");  // Navigate to the profile page
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    };
    
  // Dismiss keyboard when clicking outside an input field
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Input fields
  const inputFields = [
    { label: "Name", value: user.name, key: "name" },
    { label: "Username", value: user.username, key: "username" },
    { label: "Biography", value: user.biography, key: "biography" },
    { label: "Location", value: user.location, key: "location" },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle={"light-content"} />
  
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
  {/* Banner and avatar */}
<View style={styles.bannerAndAvatarContainer}>
  <View style={styles.bannerContainer}>
    <ImageBackground
      source={getUserImageSrc(user.banner, "profilePictures", "banner")}
      style={styles.banner}
      resizeMode="cover"
    >
      <View style={styles.buttonPosition}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPickBannerImage}
        >
          <Pencil size={20} color={"white"} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>

  <View style={styles.avatarContainer}>
    <Avatar
      uri={user?.avatar as string}
      size={75}
      key={user.avatar}
    />
    <TouchableOpacity
      style={styles.editPictureButton}
      onPress={onPickProfileImage}
    >
      <Pencil size={10} color={"white"} />
      <Text style={styles.buttonText}>Edit Picture</Text>
    </TouchableOpacity>
  </View>
</View>
      {/* Sports Section */}
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.sportsSection}>
            <SportsSection userId={currentUser?.id || ''} />
          <TouchableOpacity style={styles.editPictureButton}  onPress={() => router.push("/sportPicker")}>
            <Pencil size={10} color={"white"} />
            <Text style={styles.buttonText}>Edit Sports</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
  
      {/* Fields */}
      <View style={styles.container}>
        <FlatList
          data={inputFields}
          scrollEnabled = {false}
          renderItem={({ item }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.field}>
                <Text style={styles.text}>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  value={item.value}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setUser({ ...user, [item.key]: value })
                  }
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>
  
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" loading={loading} onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}
  const styles = StyleSheet.create({
    safeContainer: {
      backgroundColor: "#0E0E0E",
      height: "100%",
      padding : "5%"
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 10,
      marginHorizontal: 10,
    },
    title: {
      color: "white",
      fontSize: 18,
      alignSelf: "center",
      flex: 1,
      textAlign: "center",
    },
    bannerAndAvatarContainer: {
      height: "20%",
      width: "100%",
      justifyContent: "center"
    },
    avatarContainer: {
      position: "absolute",
      alignItems: "center",
    },
    bannerContainer: {
      height: "100%",
      width: "100%",
    },
    banner: {
      height: "70%",
    },
    buttonPosition: {
      alignSelf: "flex-end"
    },
    button: {
      backgroundColor: "#3F3F46",
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 8,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
    },
    sportsSection: {
      alignItems: "center",
      marginBottom: "10%"
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems :"center",
      paddingHorizontal: "5%" // Evenly space the items
    },
    sportItem: {
      alignItems: "center",
      margin : "5%", // Ensures 3 items per row
    },
    sportItemImage: {
      marginBottom: "20%",
    },
    sportName: {
      fontSize: 12,
      color: "white",
      marginBottom: "10%",
    },
    sportLevel: {
      fontSize: 10,
      color: "gray",
    },  
    editPictureButton: {
      backgroundColor: "#3F3F46",
      paddingVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 8,
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
      alignItems: "center",
    },
    container: {
      flex: 1,
      borderTopWidth : .5,
      borderColor : "#4e4e4e" // Use relative spacing
      // Make the container take up available space
       // Use percentage-based padding for flexibility
    },
    fieldContainer: {
      paddingVertical: "3%",
      borderBottomWidth : .5,
      borderColor : "#4e4e4e" // Use relative spacing
    },
    field: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: "2%", // Use relative margin
    },
    text: {
      color: "white",
      fontSize: 14,
    },
    input: {
      color: "white",
      paddingVertical: "2%", // Relative padding for vertical spacing
      paddingHorizontal: "5%", // Relative padding for horizontal spacing
      borderRadius: 8,
    },
    buttonContainer: {
      paddingHorizontal: "5%", // Flexibility with percentage-based padding
    },
  
  });