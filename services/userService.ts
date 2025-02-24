import * as SecureStore from "expo-secure-store";
import { supabase } from "@/lib/supabase";

export type User = {
  id: string;
  role : Role;
  name: string;
  username: string;
  location: string;
  biography: string;
  avatar : string;
  banner : string;
};

export enum Role {
  USER = "user",
  VERIFIED_COACH = "verifiedCoach",
}

  
const USER_CACHE_KEY = "user_data";

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

    await clearUserCache()

    // Check SecureStore for cached user data
    const cachedUser = await getFromSecureStore(USER_CACHE_KEY);
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
    await saveToSecureStore(USER_CACHE_KEY, data);
    console.log("User data securely cached.");

    return { success: true, data };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Clears the secure cached user data.
 */
export const clearUserCache = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_CACHE_KEY);
    console.log("User cache securely cleared.");
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
    await clearUserCache();
    console.log("Cache cleared after update.");

    return { success: true, msg: "User updated successfully." };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

