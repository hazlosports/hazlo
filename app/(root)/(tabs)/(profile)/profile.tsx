import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Image,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import { Avatar } from "@/components/Avatar";
import { getUserSportsWithSkillLevels } from "@/services/sportService";
import { supabase } from "@/lib/supabase";

interface UserSport {
  skilllevel: string;
  name: string;
  imageString: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [userSports, setUserSports] = useState<UserSport[]>([]);

  // Fetch user's sports data with skill levels
  useEffect(() => {
    const fetchUserSports = async () => {
      if (!user) return;
      const result = await getUserSportsWithSkillLevels(user.id as string);

      if (result.success) {
        setUserSports(result.data || []);
      } else {
        console.error("Failed to load user sports:", result.msg);
      }
    };

    fetchUserSports();
  }, [user]);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle={"light-content"} />
      {/* Banner Image */}
      <ImageBackground
        source={
          user?.bannerimage
            ? { uri: user.bannerimage }
            : require("@/assets/images/defaultBanner.png")
        }
        style={styles.banner}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(root)/(tabs)/home")}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={"white"} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/* Container */}
      <View style={styles.container}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Avatar
              uri={
                user?.profileimage
                  ? user.profileimage
                  : require("@/assets/images/defaultUser.png")
              }
              size={75}
              style={{ marginLeft: "5%" }}
            />
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.bio}>{user?.biography}</Text>
            <Text style={styles.location}>{user?.location}</Text>
          </View>
          <View style={styles.moreInfo}>
            <View style={styles.followStats}>
              <View style={styles.stat}>
                <Text style={styles.followStat}>Followers</Text>
                <Text style={styles.statNumber}>0</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.followStat}>Following</Text>
                <Text style={styles.statNumber}>0</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              <Pressable
                style={styles.button}
                onPress={() =>
                  router.replace("/(root)/(tabs)/(profile)/editProfile")
                }
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </Pressable>
              <Pressable style={styles.button}>
                <Send size={16} color={"white"} />
              </Pressable>
            </View>
          </View>
        </View>
        {/* Sports List */}
        <View style={styles.sports}>
          <View style={styles.sportsList}>
            {userSports.map((item) => (
              <View key={item.name} style={styles.sportItem}>
                <Image
                  source={{ uri: item.imageString }}
                  style={styles.sportImage}
                  resizeMode="contain"
                />
                <Text style={styles.sportName}>{item.name}</Text>
                <Text style={styles.skillLevel}>({item.skilllevel})</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Button title="Logout" onPress={onLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: "#0E0E0E",
    height: "100%",
  },
  banner: {
    height: "40%",
    justifyContent: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    paddingTop: (StatusBar.currentHeight || 20) + 40,
    paddingHorizontal: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    borderRadius: 14,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: "10%",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  avatar: {
    flex: 1,
    flexDirection: "column",
    gap: 5,
  },
  name: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    color: "white",
    marginTop: 10,
  },
  bio: {
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    color: "white",
  },
  location: {
    fontSize: 12,
    fontFamily: "Montserrat-Light",
    color: "#848484",
  },
  moreInfo: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  stat: {
    gap: 3,
    alignItems: "center",
  },
  followStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 30,
  },
  followStat: {
    color: "white",
    fontSize: 14,
    fontFamily: "Montserrat-Light",
  },
  statNumber: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#3F3F46",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  sports: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sportsList: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "100%",
  },
  sportItem: {
    alignItems: "center",
  },
  sportImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  sportName: {
    color: "white",
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    marginTop: 5,
    textTransform: "capitalize",
  },
  skillLevel: {
    color: "#848484",
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
  },
});
