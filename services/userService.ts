import * as SecureStore from "expo-secure-store";
import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  role: Role;
  name: string;
  username: string;
  location: string;
  biography: string;
  avatar: string;
  banner: string;
};

export enum Role {
  USER = "user",
  VERIFIED_COACH = "verifiedCoach",
}

/**
 * Generates a unique key for storing user data in SecureStore.
 */
const getUserCacheKey = (userId: string) => `user_data_${userId}`;

/**
 * Saves data securely in SecureStore.
 */
const saveToSecureStore = async (key: string, value: any) => {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
};

/**
 * Retrieves secure data.
 */
const getFromSecureStore = async (key: string) => {
  const data = await SecureStore.getItemAsync(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Fetches user data securely from cache or Supabase.
 */
export const getUserData = async (userId: string) => {
  try {
    console.log("Fetching user data for:", userId);

    const cacheKey = getUserCacheKey(userId);

    // Check SecureStore for cached user data
    const cachedUser = await getFromSecureStore(cacheKey);
    if (cachedUser) {
      console.log("Returning cached user data.");
      return { success: true, data: cachedUser };
    }

    // Fetch from Supabase if no cache exists
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return { success: false, msg: error.message };
    }

    // Securely cache the data
    await saveToSecureStore(cacheKey, data);
    console.log("User data securely cached.");

    return { success: true, data };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Clears the secure cached user data for a specific user.
 */
export const clearUserCache = async (userId: string) => {
  try {
    const cacheKey = getUserCacheKey(userId);
    await SecureStore.deleteItemAsync(cacheKey);
    console.log(`User cache securely cleared for user: ${userId}`);
  } catch (error) {
    console.error("Error clearing user cache:", error);
  }
};

/**
 * Updates user data and refreshes secure cache.
 */
export const updateUser = async (userId: string, data: Partial<User>) => {
  try {
    console.log("Updating user data:", data);

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user:", error);
      return { success: false, msg: error.message };
    }

    // Clear cache after update
    await clearUserCache(userId);
    console.log("Cache cleared after update.");

    return { success: true, msg: "User updated successfully." };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};
