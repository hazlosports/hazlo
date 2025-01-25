import { User } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// Function to get user data
export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.log("Warning Error: ", error);
    return { success: false, msg: error.message };
  }
};

// Function to update the user data
export const updateUser = async (userId: string, data: User) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.log("Warning Error: ", error);
    return { success: false, msg: error.message };
  }
};
