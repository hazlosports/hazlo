import { View, Text, FlatList, ScrollView, Dimensions, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@/components/UI/Button";
import { useState } from "react";
import { User, Timer, Shield, Cross, Check } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { updateUser, Role } from "@/services/userService";

const adjustedWidth = Dimensions.get("window").width;
const roles = [
  {
    title: "hazlo",
    icon: User,
    subtitle: "Athlete",
    options: [
        "Find events around you",
        "Connect with people with similar interests",
        "Find coaches and instructors ",
        "Share your progress and goals",
        "Find job opportunities in sports",
        "Access tons of content to improve your journey",
        "Be part of the community"],
    gradientColors: ["#0EA8F5", "#692EF8"] as const, // Use 'as const' to make it readonly
  },
  {
    title: "coach",
    icon: Timer,
    subtitle: "Verified Coach",
    options: [
        "Appear in the map as a HAZLO coach",
        "Reach thousands of new clients",
        "Promote and sell content ",
        "Get your account verified",
        "Be able to teach classes online",
        "Unlock premium services",
        "Be your own boss",    
        ],
    gradientColors: ["#FFBD55", "#FF7009"] as const, // Use 'as const' to make it readonly
  },
  {
    title: "club",
    icon: Shield,
    subtitle: "Institution",
    options: [
        "Promote events",
        "Manage all bookings in one place",
        "Sell merch & equipment",
        "Promote and sell content",
        "Get exposure among a sports community",
        "Post job openings",
        "Organize fundraisers",
    ],
    gradientColors:  ['#7dfaaf', "#06d43e"], // Use 'as const' to make it readonly
  },
  {
    title: "service",
    icon: Cross,
    subtitle: "Provider",
    options: [
        "Appear in the map as a Service Provider",
        "Easy and direct payment system",
        "Reach thousands of new clients",
        "Flexible scheduling",
        "Showcase your expertise ",
        "Build your reputation",
        "Grow your brand",
    ],
    gradientColors: ['#FF72DC', '#9C00D4'] as const, // Use 'as const' to make it readonly
  },
];

export default function RolePicker() {
    
  const router = useRouter();
  const { user } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);


  const currentRole = roles[selectedIndex]; 

  const setRole = async () => {
    if (selectedIndex === 1) { // If the selected role is "coach"
      if (!user?.id) return alert("User not found");
  
      setLoading(true);
  
      const { success, msg } = await updateUser(user.id, { role: Role.VERIFIED_COACH });
  
      if (!success) {
        alert(msg);
      } else {
        alert("Role updated successfully.");
      }
  
      setLoading(false);
    }
  };

  const handleContinue = async () => {

    await setRole();
  
    switch (selectedIndex) {
      case 0:
        return router.push("/sportPicker");
  
      case 1:
        return router.push("/actionScreen?component=BecomeACoach");
        
  
      default:
        return;
    }
  };
  
  
  return (
    <SafeAreaProvider>
        <View>
            <Text style={styles.title} >Choose a role</Text>
        </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / adjustedWidth);
            setSelectedIndex(newIndex);
          }}
          scrollEventThrottle={16} // More responsive scrolling
        >
          {roles.map((role, index) => {
            const IconComponent = role.icon;

            return (
              <View key={index} style={[styles.scrollPanel, { width: adjustedWidth }]}>
                <LinearGradient
                  colors={role.gradientColors} // Use the role's gradient colors
                  style={styles.gradientBorder}
                >
                  <View style={styles.panel}>
                    <View style={styles.header}>
                        <View style={ styles.profilePreview}>
                            <IconComponent size={48} color="white" />
                            <Text style={styles.title}>{"@"+user?.username}</Text>
                         </View>
                         <Text style={[styles.subtitle, { color: role.gradientColors[0] }]}>
                            {role.subtitle}
                        </Text>
                    </View>

                    <View style={styles.content}>
                    
                      <Text style={styles.subtitle}>Benefits</Text>
                      <FlatList
                        data={role.options}
                        contentContainerStyle={styles.optionList}
                        scrollEnabled={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <View style={{justifyContent: "flex-start", alignItems :"flex-start",flexDirection : "row"}}>
                            <Check color= {role.gradientColors[0]}/>                          
                            <Text style={styles.option}>{item}</Text>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button  
        onPress={() => handleContinue()}
        title="Continue" loading={loading} size= {"xl"} variant={currentRole.title as ButtonProps["variant"]} />       
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: "10%",
  },
  scrollPanel: {
    width: adjustedWidth, // Ensures proper alignment
    flex: 1,
    justifyContent: "center",
    padding: "2%",
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 14,
    padding: 0.1,
  },
  panel: {
    flex: 1,
    backgroundColor: 'black', // Ensure panel background is visible behind the gradient border
    borderRadius: 14, // Inner border radius for the panel
  },
  header: {
    flex: 0.3,
    borderColor: "white",
    paddingHorizontal: "5%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profilePreview : {
    flex : 1,
    flexDirection : "row",
    alignItems: "center",
  },
  content: {
    flex: 0.7,
    justifyContent: "space-evenly",
    padding: "5%",
  },
  optionList: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: "5%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight : 300,
    color: "white",
    paddingHorizontal : "5%",
  },
  option: {
    paddingHorizontal : "5%",
    fontSize: 14,
    fontWeight : 100,
    color: "white",
  },
  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
