import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Search } from "lucide-react-native";
import { Avatar } from "@/components/UI/Avatar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { supabase } from "@/lib/supabase"; // Assuming supabase client is set up

export default function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]); // Replace `any` with the correct user type
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query: string) => {
    if (!query.trim()) return; // Prevent empty queries

    setLoading(true);
    // Query Supabase for users where either `username` or `name` contains the search query (case-insensitive)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("username", `%${query}%`) // Search for users by username (case-insensitive)
      .or(`name.ilike.%${query}%`) // Search for users by name (case-insensitive)
      .limit(10); // Adjust the limit as needed

    if (error) {
      console.error(" Error fetching users:", error);
    } else {
      const uniqueUsers = Array.from(
        new Map(data?.map((user) => [user.id, user])).values()
      );
      setUsers(uniqueUsers); 
    }

    setLoading(false);
  };

  useEffect(() => {

    if (searchQuery.length > 0) {
      fetchUsers(searchQuery);
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  return (
    <ScreenWrapper bg="#0E0E0E" style={{ paddingHorizontal: 20 }}>
      <StatusBar style="light" />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#fff" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for users"
          placeholderTextColor="#fff"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {/* Users List */}
      {loading ? (
        <Text style={styles.loadingText}>Searching...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable style={styles.userContainer} onPress={router.push("profile?componet?userProfile{id}")}>
              <Avatar uri={item.profileimage} size={40} />
              <Text style={styles.userName}>{item.username || item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7F7D7D",
    borderRadius: 12,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: "100%",
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
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#7F7D7D",
  },
  userName: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
