import React, { useState, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Bell, Send } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/UI/Avatar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Loading } from "@/components/UI/Loading";
import { FeedItem, getFeed } from "@/services/feedService";
import Postcard from "@/components/Postcard";
import EventCard from "@/components/EventCard";
import { HazloEvent } from "@/services/eventService";
import { Post } from "@/services/postService";
import Comments from "@/components/Comments"; // Import the Comments component

let limit = 0;

export default function Home() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // Store selected postId/eventId
  const [isCommentsVisible, setIsCommentsVisible] = useState(false); // Manage comment visibility

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        if (user?.id) {
          const fetchedFeed = await getFeed(user.id, null);
          setFeed(fetchedFeed);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
        Alert.alert("Error", "Something went wrong while fetching feed.");
      }
    };
    fetchFeed();
  }, [user?.id]);

  const getMoreFeed = async () => {
    if (!hasMore || !user?.id) return;
    limit += 10;
    try {
      const lastItem = feed[feed.length - 1];
      const lastCreatedAt = lastItem?.data?.created_at || null;
      const fetchedFeed = await getFeed(user.id, lastCreatedAt);
      if (fetchedFeed.length === 0) setHasMore(false);
      setFeed((prevFeed) => [...prevFeed, ...fetchedFeed]);
    } catch (error) {
      console.error("Error fetching more feed:", error);
      Alert.alert("Error", "Something went wrong while fetching more feed.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    limit = 0;
    try {
      const fetchedFeed = await getFeed(user?.id as string, null);
      setFeed(fetchedFeed);
    } catch (error) {
      console.error("Error fetching refreshed feed:", error);
      Alert.alert("Error", "Something went wrong while refreshing feed.");
    }
    setRefreshing(false);
  };

  function isPost(item: FeedItem): item is { type: "post"; data: Post } {
    return item.type === "post";
  }

  function isEvent(item: FeedItem): item is { type: "event"; data: HazloEvent } {
    return item.type === "event";
  }

  const handleCommentButtonClick = (postId: string) => {
    setSelectedPostId(postId); // Set the selected post's ID
    setIsCommentsVisible(true); // Show the Comments panel
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    if (isPost(item)) {
      return (
        <Postcard
          item={item.data}
          currentUser={user}
          router={router}
          onCommentPress={() => handleCommentButtonClick(item.data.id)} // Pass the comment button click handler
        />
      );
    } else if (isEvent(item)) {
      return (
        <Pressable
        onPress={() => {
          router.push({
            pathname: "/(root)/(event)/eventDetails",
            params: { event: JSON.stringify(item.data) },
          });
        }}
      >
        <EventCard event={item.data} />
      </Pressable>
      );
    }
    return null;
  };

  return (
    <ScreenWrapper bg={"#0a0a0a"} style={{}}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            router.navigate(`/profile?component=${user?.role}&userId=${user?.id}`)
          }
        >
          <Avatar uri={user?.avatar as string} size={32} />
        </Pressable>
        <Pressable onPress={() => router.navigate("/home")}></Pressable>
        <Pressable onPress={() => {}}>
          <Bell size={24} color={"white"} />
        </Pressable>
        <Pressable>
          <Send size={24} color={"white"} />
        </Pressable>
      </View>
      <FlatList
        data={feed}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.data?.id?.toString()}
        renderItem={renderFeedItem}
        onEndReachedThreshold={0.1}
        onEndReached={getMoreFeed}
        ListFooterComponent={
          hasMore ? (
            <View style={{ marginVertical: feed.length === 0 ? 200 : 40 }}>
              <Loading />
            </View>
          ) : (
            <View style={{ backgroundColor: "#0f0f0f", paddingVertical: 30 }}>
              <Text style={{ color: "gray", textAlign: "center" }}>
                No more feed
              </Text>
            </View>
          )
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      {/* Comments panel */}
      {selectedPostId && isCommentsVisible && (
        <Comments
          postId={selectedPostId}
          isVisible={isCommentsVisible}
          toggleVisibility={() => setIsCommentsVisible(!isCommentsVisible)} // Toggle visibility of comments
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5%",
    borderBottomWidth: 0.5,
    borderColor: "#1e1e1e",
  },
  listStyle: {
    backgroundColor: "#0e0e0e",
  },
});
