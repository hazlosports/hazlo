import React, { useRef,useEffect, useState } from 'react';
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import { getUserData } from "@/services/userService";
import { getUserImageSrc } from '@/services/imageService';
import Dashboard from '@/components/UI/Dashboard';
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
  const [userData, setUserData] = useState<any>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [visibleItems, setVisibleSportItems] = useState(3); // Start by showing 3 items
 
  useEffect(() => { 
    
    const fetchUserData = async () => {
      if (!user?.id) return;
      const { success, data } = await getUserData(userId);
      if (success) setUserData(data);
    };
    const fetchFollowersData = async () => {
      if (!user) return;

      const { count: followers } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("followed_id", user.id);

      const { count: following } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    };

    fetchUserData();
    fetchFollowersData();
  }, [user]);
  
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
        <Text style={[styles.text, styles.username]}>{user?.username}</Text>
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
                        <Check size={16} color="orange" style={styles.checkmark} />
                      </View>
                    </View>
                    <Text style={styles.verification}>
                      {user?.role
                        ? user.role.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim()
                        : ""}
                    </Text>                   
                  </View>
                  <View style={styles.locationAndBioContainer}>
                    <Text style={styles.location}>{userData?.location}</Text>
                    <Text style={styles.bio}>{userData?.biography}</Text>
                  </View>
                </View>
                <View style={styles.rightProfileSection}>
                  {/* Edit Profile & Notification Buttons */}
                  <View style={styles.profileActionsButtonContainer}>
                    <TouchableOpacity
                      style={styles.editOrFollowButton}
                      onPress={() => router.navigate("/editProfile")}
                    >
                      <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.settingsOrBellButton}
                      onPress={() => router.navigate("/editProfile")}
                    >
                      <Bell size={18} color={"white"} />
                    </TouchableOpacity>           
                  </View>
                </View>    
              </View>
            </View>
            <View>
          </View>
        </View>
        </View>
        <View style={styles.componentContainer}>
          {SelectedComponent ? <SelectedComponent userId={user?.id ?? ""} /> : null} 
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor  : "#0f0f0f"
  },
  profileContainer : {
    flex: 1,
    backgroundColor  :  "#0f0f0f"
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
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  checkTester: {
    borderWidth: 1,
    borderRadius: '100%',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    marginHorizontal: '10%',
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
  bio: {
    fontSize: 14,
    color: 'white',
  },
  componentContainer : {
    flex  :1,
  }
 
});





