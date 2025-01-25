import { supabase } from "@/lib/supabase";

export async function getUserSportsWithSkillLevels(userId: string) {
  try {
    const { data, error } = await supabase
      .from("usersports")
      .select(
        `
      level,
      sports (
        name,
        imagestring
      )
    `
      )
      .eq("userid", userId);

    if (error) {
      console.error("Error fetching user sports:", error);
      return { success: false, msg: error.message };
    }

    // Map the data to get the desired output format
    const userSports = data.map((item: any) => ({
      skilllevel: item.level,
      name: item.sports.name,
      imageString: item.sports.imagestring,
    }));

    return { success: true, data: userSports };
  } catch (error: any) {
    console.log("Warning Error: ", error);
    return { success: false, msg: error.message };
  }
}

export async function getUserSportImages(userId: string) {
  try {
    const { data, error } = await supabase
      .from("usersports")
      .select(
        `
        sports (
          imagestring
        )
      `
      )
      .eq("userid", userId);

    if (error) {
      console.error("Error fetching user sport images:", error);
      return { success: false, msg: error.message };
    }

    // Map the data to extract only the imagestring
    const sportImages = data.map((item: any) => item.sports.imagestring);

    return { success: true, data: sportImages };
  } catch (error: any) {
    console.log("Warning Error: ", error);
    return { success: false, msg: error.message };
  }
}
