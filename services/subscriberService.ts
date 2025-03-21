import { supabase } from "@/lib/supabase";

export type Subscription = {
  id?: string;
  pack_id: string;
  subscriber_id: string;
  nextExpiryDate: string; // timestamptz
};

/**
 * Subscribes a user to a pack.
 */
export const subscribeToPack = async (
  subscriberId: string,
  packId: string
) => {
  try {
    const { data, error } = await supabase.from("subscribers").insert({
      subscriber_id: subscriberId,
      pack_id: packId,
    });

    if (error) {
      console.error("Error subscribing to pack:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Unsubscribes a user from a pack.
 */
export const unsubscribeFromPack = async (subscriberId: string, packId: string) => {
  try {
    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("subscriber_id", subscriberId)
      .eq("pack_id", packId);

    if (error) {
      console.error("Error unsubscribing from pack:", error);
      return { success: false, msg: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets the list of packs a user is subscribed to.
 */
export const getUserSubscriptions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select("pack_id, nextExpiryDate")
      .eq("subscriber_id", userId);

    if (error) {
      console.error("Error fetching user subscriptions:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets the list of subscribers for a specific pack.
 */
export const getPackSubscribers = async (packId: string) => {
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select("subscriber_id, nextExpiryDate")
      .eq("pack_id", packId);

    if (error) {
      console.error("Error fetching pack subscribers:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Checks if a user is subscribed to a specific pack.
 */
export const isSubscribedToPack = async (subscriberId: string, packId: string) => {
  try {
    const { data, error } = await supabase
      .from("subscribers")
      .select("nextExpiryDate")
      .eq("subscriber_id", subscriberId)
      .eq("pack_id", packId)
      .single();

    if (error && error.code !== "PGRST116") { // Ignore "No rows found" error
      console.error("Error checking subscription status:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, isSubscribed: !!data, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};