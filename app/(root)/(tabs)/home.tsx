import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Bell, Send, Search, SquarePlus } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/Avatar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { getUserData } from "@/services/userService";
import { fetchPosts } from "@/services/postService";
import Postcard, { Post } from "@/components/Postcard";
import { Loading } from "@/components/Loading";
import { supabase } from "@/lib/supabase";

var limit = 0;

export default function Home() {
  const { user } = useAuth();

  const needsOnboarding = async (userid: string | undefined) => {
    let res = await getUserData(userid as string);
    if (res.success && res.data.username === null) return true;
    return false;
  };

  useEffect(() => {
    const checkOnboarding = async () => {
      if (await needsOnboarding(user?.id)) {
        router.push("/onboarding");
      }
    };

    if (user) {
      checkOnboarding();
    }
  }, [user, router]);

  const [posts, setPosts] = useState<Post[] | undefined>([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload: any) => {
    if (payload.eventType == "INSERT" && payload.new.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userid);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...(prevPosts || [])]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;

    limit = limit + 10;

    if (user && user.id) {
      let res = await fetchPosts(user.id, limit);

      if (res.success && res.data) {
        if (posts?.length === res.data.length) setHasMore(false);
        setPosts(res.data);
      }
    } else {
      console.log("User is not authenticated or user.id is undefined.");
    }
  };

  return (
    <ScreenWrapper bg={"#0E0E0E"} style={{ paddingHorizontal: 20 }}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(root)/(tabs)/(profile)/profile")}
        >
          <Avatar uri={user?.profileimage as string} size={32} />
        </Pressable>
        <Pressable onPress={() => router.replace("/(root)/(tabs)/post")}>
          <SquarePlus size={24} color={"white"} />
        </Pressable>
        {/* Search Input with Icon */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#fff" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor="#fff"
            autoCapitalize="none"
          />
        </View>
        <Pressable onPress={() => {}}>
          <Bell size={24} color={"white"} />
        </Pressable>
        <Pressable>
          <Send size={24} color={"white"} />
        </Pressable>
      </View>
      {/* Posts */}
      <View style={{ marginTop: 10 }}>
        {posts && (
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Postcard item={item} currentUser={user} router={router} />
            )}
            onEndReachedThreshold={0}
            onEndReached={() => {
              getPosts();
            }}
            ListFooterComponent={
              hasMore ? (
                <View style={{ marginVertical: posts.length == 0 ? 200 : 40 }}>
                  <Loading />
                </View>
              ) : (
                <View style={{ marginVertical: 30 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Montserrat-Medium",
                    }}
                  >
                    No more posts
                  </Text>
                </View>
              )
            }
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F7D7D",
    borderRadius: 12,
    paddingHorizontal: 8,
    width: "40%",
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 14,
    paddingVertical: 8,
  },
  listStyle: {
    paddingTop: 20,
  },
});
