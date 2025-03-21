import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, Pressable, ActivityIndicator } from "react-native";
import { UserSport, getSportImageSource, getUserSportsWithSkillLevels } from "@/services/sportService";

export default function SportsSection({ userId }: { userId: string }) {

    const [userSports, setUserSports] = useState<UserSport[]>([]);
    const [visibleItems, setVisibleSportItems] = useState(3);
    const [loading, setLoading] = useState(true);

     
     
    useEffect(() => {
        const fetchUserSports = async () => {
          if (!userId) return;
      
          setLoading(true); // Set loading before fetching
      
          try {
            const result = await getUserSportsWithSkillLevels(userId);
            if (result.success) {
              setUserSports(result.data || []);
            }
          } catch (error) {
            console.error("Error fetching user sports:", error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchUserSports();
      }, [userId]);

  const handleShowMore = () => {
    setVisibleSportItems((prev) => Math.min(prev + 3, userSports.length));
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (userSports.length === 0) {
    return <Text>No sports selected</Text>;
  }

  return (
    <View>
      <View style={styles.gridContainer}>
        {userSports.slice(0, visibleItems).map((item, index) => (
          <View key={index} style={styles.sportItem}>
            <Image
              source={getSportImageSource(item.imageString)}
              style={styles.sportItemImage}
              resizeMode="contain"
            />
            <Text style={styles.sportName}>{item.name}</Text>
            <Text style={styles.sportLevel}>{item.level}</Text>
          </View>
        ))}
      </View>

      {visibleItems < userSports.length && (
        <Pressable style={styles.gridButton} onPress={handleShowMore}>
          <Text style = {{ fontSize: 12, color: "gray"}}>Show more</Text>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({

gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems :"center",
    paddingHorizontal: "5%" // Evenly space the items
  },
  gridButton:{
    alignSelf: "flex-end",
    padding : "5%",
  },
  sportItem: {
    alignItems: "center",
    paddingHorizontal : "10%", // Ensures 3 items per row
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
});