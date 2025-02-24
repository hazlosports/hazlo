import { supabase } from "@/lib/supabase";

export type Follower = {
  id?: string;
  follower_id: string;
  followed_id: string;
};

/**
 * Follows a user.
 */
export const followUser = async (followerId: string, followedId: string) => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .insert({ follower_id: followerId, followed_id: followedId });

    if (error) {
      console.error("Error following user:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Unfollows a user.
 */
export const unfollowUser = async (followerId: string, followedId: string) => {
  try {
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("follower_id", followerId)
      .eq("followed_id", followedId);

    if (error) {
      console.error("Error unfollowing user:", error);
      return { success: false, msg: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets the list of users a specific user is following.
 */
export const getFollowing = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", userId);

    if (error) {
      console.error("Error fetching following list:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets the list of followers for a specific user.
 */
export const getFollowers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("follower_id")
      .eq("followed_id", userId);

    if (error) {
      console.error("Error fetching followers list:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Checks if a user is following another user.
 */
export const isFollowing = async (followerId: string, followedId: string) => {
  try {
    const { data, error } = await supabase
      .from("followers")
      .select()
      .eq("follower_id", followerId)
      .eq("followed_id", followedId)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore "No rows found" error
      console.error("Error checking follow status:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, isFollowing: !!data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};
