import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "@/components/Avatar";
import { getUserSportImages } from "@/services/sportService";
import { Button } from "@/components/Button";
import { uploadFile } from "@/services/imageService";
import { updateUser } from "@/services/userService";

export default function editProfile() {
  const { user: currentUser, setUserData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    biography: "",
    location: "",
    bannerimage: "",
    profileimage: "",
  });
  const [userSports, setUserSports] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        username: currentUser.username || "",
        biography: currentUser.biography || "",
        location: currentUser.location || "",
        bannerimage: currentUser.bannerimage || "",
        profileimage: currentUser.profileimage || "",
      });
    }
  }, []);

  // Fetch user's sports images
  useEffect(() => {
    const fetchUserSports = async () => {
      if (currentUser?.id) {
        const result = await getUserSportImages(currentUser.id);
        if (result.success) {
          setUserSports(result.data || []);
        } else {
          console.error("Failed to load user sports images:", result.msg);
        }
      }
    };

    fetchUserSports();
  }, [currentUser]);

  // Function to replace the bannerimage
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
        bannerimage: result.assets[0].uri,
      }));
    }
  };
  // Function to replace the profileimage
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
        profileimage: result.assets[0].uri,
      }));
    }
  };
  // To update the profileimage
  let userProfileImage = user.profileimage
    ? { uri: user.profileimage }
    : currentUser?.profileimage
      ? { uri: currentUser.profileimage }
      : null;
  //To update the bannerimage
  let userBannerImage = user.bannerimage
    ? { uri: user.bannerimage }
    : currentUser?.bannerimage
      ? { uri: currentUser.bannerimage }
      : null;

  // Update the user
  const onSubmit = async () => {
    let userData = { ...user };
    let { name, username, biography, location, bannerimage, profileimage } =
      userData;

    // Ensure profileimage and bannerimage are not undefined
    const profileImage = profileimage || ""; // Provide fallback if undefined
    const bannerImage = bannerimage || ""; // Provide fallback if undefined

    if (
      !name ||
      !username ||
      !biography ||
      !location ||
      !profileImage ||
      !bannerImage
    ) {
      Alert.alert("Profile", "Please fill all the fields");
      return;
    }

    setLoading(true);

    // Handle the profile image upload if changed
    if (profileImage && typeof profileImage === "object") {
      let imageRes = await uploadFile("profiles", profileImage, true);
      if (imageRes.success) {
        userData.profileimage = imageRes.data as string;
      } else {
        userData.profileimage = "";
      }
    }

    // Handle the banner image upload if changed
    if (bannerImage && typeof bannerImage === "object") {
      let bannerRes = await uploadFile("banners", bannerImage, true);
      if (bannerRes.success) {
        userData.bannerimage = bannerRes.data as string;
      } else {
        userData.bannerimage = "";
      }
    }

    // Set the profileimage and bannerimage to strings
    userData.profileimage = profileImage;
    userData.bannerimage = bannerImage;

    const res = await updateUser(currentUser?.id as string, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.replace("/(root)/(tabs)/(profile)/profile");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle={"light-content"} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(root)/(tabs)/(profile)/profile")}
        >
          <ChevronLeft size={24} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      {/* Banner Container */}
      <View style={styles.bannerContainer}>
        {userBannerImage ? (
          <ImageBackground
            source={userBannerImage}
            style={styles.banner}
            resizeMode="cover"
          >
            <View style={styles.buttonPosition}>
              <TouchableOpacity
                style={styles.button}
                onPress={onPickBannerImage}
              >
                <Pencil size={10} color={"white"} />
                <Text style={styles.buttonText}>Edit Banner</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.banner}>
            <View style={styles.buttonPosition}>
              <TouchableOpacity
                style={styles.button}
                onPress={onPickBannerImage}
              >
                <Pencil size={10} color={"white"} />
                <Text style={styles.buttonText}>Edit Banner</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      {/* Avatar and Sports */}
      <View style={styles.topSection}>
        <View style={styles.avatar}>
          <Avatar
            uri={user.profileimage || currentUser?.profileimage || ""}
            size={75}
            key={user.profileimage}
          />
          <TouchableOpacity
            style={styles.editPictureButton}
            onPress={onPickProfileImage}
          >
            <Pencil size={10} color={"white"} />
            <Text style={styles.buttonText}>Edit Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sportsContainer}>
          <View style={styles.sports}>
            {userSports.map((item) => (
              <Image
                source={{ uri: item }}
                style={styles.sportImage}
                resizeMode="contain"
                key={item}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.editPictureButton} onPress={() => {}}>
            <Pencil size={10} color={"white"} />
            <Text style={styles.buttonText}>Edit Sports</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Fields */}
        <View style={styles.fieldContainer}>
          <View style={styles.field}>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              autoCapitalize="none"
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
          </View>
          <View style={styles.dividerGray} />
          <View style={styles.field}>
            <Text style={styles.text}>Username</Text>
            <TextInput
              style={styles.input}
              value={user.username}
              autoCapitalize="none"
              onChangeText={(value) => setUser({ ...user, username: value })}
            />
          </View>
          <View style={styles.dividerGray} />
          <View style={styles.field}>
            <Text style={styles.text}>Biography</Text>
            <TextInput
              style={[
                styles.input,
                { minHeight: 80, textAlignVertical: "top" },
              ]}
              value={user.biography}
              autoCapitalize="none"
              onChangeText={(value) => setUser({ ...user, biography: value })}
              multiline={true}
            />
          </View>
          <View style={styles.dividerGray} />
          <View style={styles.field}>
            <Text style={styles.text}>Location</Text>
            <TextInput
              style={styles.input}
              value={user.location}
              autoCapitalize="none"
              onChangeText={(value) => setUser({ ...user, location: value })}
            />
          </View>
          <View style={styles.dividerGray} />
        </View>
        {/* Awards */}
        {/* Button */}
        <View style={{ marginTop: 20 }}>
          <Button title="Save Changes" loading={loading} onPress={onSubmit} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#0E0E0E",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: {
    color: "white",
    fontFamily: "Montserrat-SemiBold",
    fontSize: 26,
    alignSelf: "center",
  },
  bannerContainer: {
    marginTop: 10,
    height: "20%",
    width: "100%",
  },
  banner: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
  },
  buttonPosition: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#3F3F46",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 10,
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
    position: "absolute",
    top: "31%",
    zIndex: 1,
  },
  avatar: {
    alignItems: "center",
  },
  editPictureButton: {
    marginTop: 10,
    backgroundColor: "#3F3F46",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  sportsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingRight: 20,
    marginTop: 34,
  },
  sports: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sportImage: {
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 20,
    marginTop: "30%",
  },
  divider: {
    height: 2,
    backgroundColor: "#0EA8F5",
    marginBottom: "2%",
  },
  dividerGray: {
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  field: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "white",
    flex: 1,
  },
  input: {
    backgroundColor: "#0E0E0E",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    height: 30,
    flex: 2,
  },
});
