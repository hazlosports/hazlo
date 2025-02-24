import { supabase } from "@/lib/supabase";

export type Lesson = {
  id?: string;
  coach_id: string;
  user_id: string;
  location: string;
  date: string;
  sport_id: number;
  status: string;
};

/**
 * Creates or updates a lesson.
 */
export const createOrUpdateLesson = async (lesson: Lesson) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .upsert(lesson)
      .select()
      .single();

    if (error) {
      console.error("Error saving lesson:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets a lesson by ID.
 */
export const getLessonById = async (lessonId: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select()
      .eq("id", lessonId)
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets lessons by coach ID.
 */
export const getLessonsByCoach = async (coachId: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select()
      .eq("coach_id", coachId);

    if (error) {
      console.error("Error fetching coach lessons:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets lessons for a user.
 */
export const getLessonsForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select()
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user lessons:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets lessons by location.
 */
export const getLessonsByLocation = async (location: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select()
      .eq("location", location);

    if (error) {
      console.error("Error fetching lessons by location:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets lessons by date.
 */
export const getLessonsByDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select()
      .eq("date", date);

    if (error) {
      console.error("Error fetching lessons by date:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Updates lesson status.
 */
export const updateLessonStatus = async (lessonId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .update({ status })
      .eq("id", lessonId)
      .select()
      .single();

    if (error) {
      console.error("Error updating lesson status:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};
