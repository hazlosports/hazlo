import * as SecureStore from "expo-secure-store";
import { supabase } from "@/lib/supabase";

export type UserSport = {
  level: UserLevel;
  name: string;
  imageString: string;
};

export enum UserLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}

const USER_SPORTS_CACHE_KEY = "user_sports";

/**
 * Saves data securely in SecureStore.
 */
const saveToSecureStore = async (key: string, value: any) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to SecureStore (${key}):`, error);
  }
};

/**
 * Retrieves secure data.
 */
const getFromSecureStore = async (key: string) => {
  try {
    const data = await SecureStore.getItemAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving from SecureStore (${key}):`, error);
    return null;
  }
};

/**
 * Clears the secure cached user sports data.
 */
export async function clearUserSportsCache() {
  try {
    await SecureStore.deleteItemAsync(USER_SPORTS_CACHE_KEY);
    console.log("User sports cache securely cleared.");
  } catch (error) {
    console.error("Error clearing user sports cache:", error);
  }
}

/**
 * Fetches user sports from cache first, then from Supabase if cache is missing or outdated.
 */
export async function getUserSportsWithSkillLevels(userId: string) {
  try {
    console.log("Fetching user sports for:", userId);

    // Try to get cached data
    const cachedSports = await getFromSecureStore(USER_SPORTS_CACHE_KEY);
    if (cachedSports) {
      console.log("Returning cached user sports.");
      return { success: true, data: cachedSports };
    }

    // Fetch from Supabase if no cache
    const { data, error } = await supabase
      .from("usersports")
      .select(`
        level,
        sports (
          name,
          imagestring
        )
      `)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user sports:", error);
      return { success: false, msg: error.message };
    }

    if (!data || data.length === 0) {
      console.log("No user sports found.");
      return { success: true, data: [] };
    }

    // Format and cache data
    const userSports = data.map((item: any) => ({
      level: item.level,
      name: item.sports.name,
      imageString: item.sports.imagestring,
    }));

    await saveToSecureStore(USER_SPORTS_CACHE_KEY, userSports);
    console.log("User sports securely cached.");

    return { success: true, data: userSports };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
}

/**
 * Updates or adds a user sport and refreshes the local cache.
 */
export async function setUserSport(userId: string, sportId: number, level: string) {
  try {
    console.log("Updating or adding user sport:", { userId, sportId, level });

    const { data, error } = await supabase
      .from("usersports")
      .upsert([{ user_id: userId, sport_id: sportId, level }]);

    if (error) {
      console.error("Error upserting user sport:", error);
      return { success: false, msg: error.message };
    }

    // Refresh cache after update
    await clearUserSportsCache();
    console.log("Cache cleared after update.");

    return { success: true, msg: "Sport added/updated successfully." };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
}

/**
 * Fetches all sports available in the database.
 */
export async function getAllSports() {
  try {
    const { data, error } = await supabase
      .from("sports")
      .select("id, name, imagestring");

    if (error) {
      console.error("Error fetching sports:", error);
      return { success: false, msg: error.message };
    }

    console.log("Fetched Sports Data:", data);
    return { success: true, data };
  } catch (error: any) {
    console.log("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
}

/**
 * Maps image string to local assets.
 */
export const getSportImageSource = (imageString: string) => {
  switch (imageString) {
    case "tennis.png":
      return require("@/assets/icons/tennis.png");
    case "yoga.png":
      return require("@/assets/icons/yoga.png");
    case "soccer.png":
      return require("@/assets/icons/soccer.png");
    case "football.png":
      return require("@/assets/icons/football.png");
    default:
      return require("@/assets/icons/football.png");
  }
};
