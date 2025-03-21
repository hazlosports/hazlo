import React, { useRef,useEffect, useState } from 'react';
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Check ,Bell} from "lucide-react-native";
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { User, getUserData } from "@/services/userService";
import { followUser, unfollowUser, isFollowing } from '@/services/followerService';
import { getUserImageSrc } from '@/services/imageService';
import { DashboardItem } from '@/components/UI/Dashboard';
import { UserProfile } from '@/components/UserProfile';
import { CoachProfile } from '@/components/CoachProfile';

const HEADER_HEIGHT_EXPANDED = 40;
const HEADER_HEIGHT_NARROWED = 100;


const AnimatedImageBackground = Animated.createAnimatedComponent(
  ImageBackground
);

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const COMPONENTS: Record<string, { component: React.ComponentType<{ userId: string }>}> = {
  user: { component: UserProfile},
  verifiedCoach: { component: CoachProfile},
};

export default function WrappedApp() {
  
  // Keeps notches away
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
 

function App() {

  const router = useRouter();
  const { component, userId } = useLocalSearchParams<{ component: string; userId: string }>();

  const SelectedComponent = COMPONENTS[component as string]?.component;
  
  console.log (SelectedComponent);

  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const { user } = useAuth();
  const [userData, setUserData] = useState<User>();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isUserFollowing, setIsUserFollowing] = useState(false); 
  const [expanded, setExpanded] = useState(false);

  const fetchUserData = async () => {
    if (!userId) return;
    const { success, data } = await getUserData(userId);
    if (success) setUserData(data);
  };
  const fetchFollowersData = async () => {
    if (!userId) return;
    const { count: followers } = await supabase
      .from("followers")
      .select("*", { count: "exact", head: true })
      .eq("followed_id", userId);

    const { count: following } = await supabase
      .from("followers")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", userId);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  };

  const checkIfFollowing = async () => {
    if (userId && user?.id) {
      const result = await isFollowing(user?.id, userId);
      if (result.success) {
        setIsUserFollowing(result.isFollowing || false);  // Default to false if isFollowing is undefined
      } else {
        setIsUserFollowing(false);  // Handle the case when the call is unsuccessful
      }
    }
  };

  useEffect(() => { 
    checkIfFollowing();
    fetchUserData();
    fetchFollowersData();
  }, []);

  const handleFollowUnfollow = async () => {
    if (!userId || !user?.id) return;

    try {
      if (isUserFollowing) {
        // If the user is already following, unfollow them
        await unfollowUser(userId, user?.id);
        setIsUserFollowing(false); // Update state
      } else {
        // If the user is not following, follow them
        await followUser(user?.id, userId);
        setIsUserFollowing(true); // Update state
      }
      fetchFollowersData(); // Update follower count
    } catch (error) {
      console.error("Error with follow/unfollow action:", error);
    }
  };
  
  const items: DashboardItem[] = [
    { icon: 'book-open', label: 'Lessons' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'video', label: 'Media' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
  
      {/* Back button */}
      <TouchableOpacity
      onPress={() => {router.back()}} // Go back to the previous page
      style={{
        zIndex: 2,
        position: "absolute",
        top: insets.top,
        left: "5%",
        height: 30,
        width: 30,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Feather name="chevron-left" color="white" size={26} />
    </TouchableOpacity>
  
      {/* Refresh arrow */}
      <Animated.View
        style={{
          zIndex: 2,
          position: 'absolute',
          top: insets.top + 13,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: scrollY.interpolate({
            inputRange: [-20, 0],
            outputRange: [1, 0],
          }),
          transform: [
            {
              rotate: scrollY.interpolate({
                inputRange: [-45, -35],
                outputRange: ['180deg', '0deg'],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <Feather name="arrow-down" color="white" size={25} />
      </Animated.View>
  
      {/* Name + tweets count */}
      <Animated.View
        style={{
          zIndex: 2,
          position: 'absolute',
          top: insets.top + 6,
          left: 0,
          right: 0,
          alignItems: 'center',
          opacity: scrollY.interpolate({
            inputRange: [90, 110],
            outputRange: [0, 1],
          }),
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [90, 120],
                outputRange: [30, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <Text style={[styles.text, styles.username]}>{userData?.username}</Text>
        <Text style={[styles.text, styles.tweetsCount]}>Followers {followersCount}</Text>
      </Animated.View>
  
      {/* Banner */}
      <AnimatedImageBackground
        source={getUserImageSrc(userData?.banner, "profilePictures", "banner")}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_NARROWED,
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [-62.5, 0], // (HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_NARROWED) / 2 = 62.5
                outputRange: [2, 1],
                extrapolateLeft: 'extend',
                extrapolateRight: 'clamp',
              }),
            },
          ],
        }}
      >
        <AnimatedBlurView
          tint="dark"
          intensity={96}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 2,
            opacity: scrollY.interpolate({
              inputRange: [-50, 0, 50, 100],
              outputRange: [1, 0, 0, 1],
            }),
          }}
        />
      </AnimatedImageBackground>
  
      {/* Tweets/profile */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        style={{
          zIndex: 3,
          marginTop: HEADER_HEIGHT_NARROWED,
          paddingTop: HEADER_HEIGHT_EXPANDED,
        }}
      >
        <View style={[styles.container, { backgroundColor: '#0e0e0e' }]}>
          <View style={styles.profileContainer}>
            {/* Avatar */}
            <Animated.Image
              source={getUserImageSrc(userData?.avatar, "profilePictures", "avatar")}
              style={{
                width: 75,
                height: 75,
                borderRadius : "100%",
                borderColor : "#0e0e0e",
                marginTop: "-7%",
                marginLeft: "7%",                
                transform: [
                  {
                    scale: scrollY.interpolate({
                      inputRange: [0, HEADER_HEIGHT_EXPANDED],
                      outputRange: [1, 0.6],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, HEADER_HEIGHT_EXPANDED],
                      outputRange: [0, 16],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              }}
            />
  
            <View style={styles.infoSectionContainer}>
              {/* Profile Info */}
              <View style={styles.topContainer}>
                <View style={styles.topLineContainer}>
                  <View style={styles.followStatsContainer}>
                    <View style={styles.stat}>
                      <Text style={styles.followStat}>Followers</Text>
                      <Text style={styles.statNumber}>{followersCount}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.followStat}>Following</Text>
                      <Text style={styles.statNumber}>{followingCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
  
              <View style={styles.profileInfoContainer}>
                <View style={styles.leftProfileSection}>
                  {/* Name, Verification */}
                  <View style={styles.userInfoContainer}>
                    <View style={styles.nameAndCheck}>
                      <Text style={styles.name}>
                        {userData?.name
                          ?.split(" ")
                          .map(
                            (word: string) =>
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </Text>
                      <View style={styles.checkTester}>
                        <Image
                          source={require("@/assets/images/Group 967 (2).png")}
                        />
                      </View>
                    </View>
                                       
                  </View>
                  <View style={styles.locationAndBioContainer}>
                    <Text style={styles.location}>{userData?.location}</Text>
                  </View>
                </View>
                <View style={styles.rightProfileSection}>
                  {/* Edit Profile & Notification Buttons */}
                  <View style={styles.profileActionsButtonContainer}>
                  {user?.id === userId ? (
                    <TouchableOpacity
                      style={styles.editOrFollowButton}
                      onPress={() => router.navigate("/editProfile")}
                    >
                      <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.editOrFollowButton}
                      onPress={handleFollowUnfollow}
                    >
                      <Text style={styles.buttonText}>
                        {isUserFollowing ? "Unfollow" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  )}
                    <TouchableOpacity
                      style={styles.settingsOrBellButton}
                      onPress={() => router.navigate("/calendar")}
                    >
                      <Bell size={18} color={"white"} />
                    </TouchableOpacity>           
                  </View>
                </View> 
              </View>
              {/*About section*/}

              <View style={styles.bioContainer}>
                {/* Biography Section */}
                {expanded && (
                  <> 
                  <Text style={styles.bioSubtitle}>About</Text>
                  </>
                )}
                <Text style={styles.bio} numberOfLines={expanded ? undefined : 2}>
                  {user?.biography}
                </Text>

                {/* Show extra texts only when expanded */}
                {expanded && (
                  <>
                    <Text style={styles.bioSubtitle}>Experience</Text>
                    <Text style={styles.bio}>Additional Text 2</Text>
                  </>
                )}

                {/* See More / See Less Button */}
                {user?.biography && (
                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={styles.seeMore}>
                      {expanded ? "See Less" : "See More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
            <View>
          </View>
        </View>
        </View>
       
        <View style={styles.componentContainer}>
          {SelectedComponent ? <SelectedComponent userId={userId ?? ""} /> : null} 
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor  : "#0e0e0e",
  },
  profileContainer : {
    flex: 1,
    backgroundColor  : "#0e0e0e",
  },
  text: {
    color: 'white',
  },
  subtitle :{
    fontSize: 18,
    fontWeight: "200",
    color: 'white',
    paddingHorizontal : "5%"
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -3,
  },
  tweetsCount: {
    fontSize: 13,
  },
  // Back button (absolute positioning)
  backButton: {
    zIndex: 2,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Refresh arrow (absolute positioning)
  refreshArrow: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Profile Info Section
  infoSectionContainer: {
    paddingHorizontal: '5%',
  },
  // Top Container
  topContainer: {
    marginTop: '-10%',
    paddingHorizontal: '5%',
    alignItems: 'flex-end',
  },
  topLineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  followStatsContainer: {
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
  },
  followStat: {
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: '5%',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'medium',
    color: 'white',
  },
  // Profile Info container
  profileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftProfileSection: {
    flex: 0.5,
    flexDirection: 'column',
  },
  rightProfileSection: {
    flex: 0.5,
  },
  // User Info
  userInfoContainer: {
    justifyContent: 'flex-start',
  },
  nameAndCheck: {
    flexDirection: 'row',
    alignItems : "center",
    justifyContent : "flex-start"
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  checkTester: {
    paddingHorizontal : "10%" 
 },
  verification: {
    fontSize: 12,
    color: 'orange',
    fontWeight: 'light',
  },

  // Profile Actions (Edit Profile & Notification Buttons)
  profileActionsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  editOrFollowButton: {
    flex: 0.8,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  settingsOrBellButton: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: '2%',
  },

  // Location & Bio
  locationAndBioContainer: {
    paddingHorizontal: '2%',
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  bioContainer:{
    paddingVertical :"5%",
  },
  bioSubtitle:{
    fontSize: 16,
    fontWeight: "semibold",
    color: 'white',
  },
  bio: {
    fontSize: 14,
    color: 'white',
  },
  seeMore:{
    color: "blue", // Customize the color
    fontWeight: "semibold",
    marginTop: 5,
  },
  componentContainer : {
    flex  :1,
    backgroundColor :"#1f1f1f"
  }
 
});





