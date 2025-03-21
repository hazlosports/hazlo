import { supabase } from "@/lib/supabase";

export type HazloEvent = {
  id: string;
  host_id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  sport_id: number;
  banner?: string;
  created_at: string;
};

export type Assistant = {
  user_id: string;
  event_id: string;
  status: string;
  subscribed_at: string;
};

/**
 * Creates or updates an event.
 */
export const createOrUpdateEvent = async (event: HazloEvent) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .upsert(event)
      .select()
      .single();

    if (error) {
      console.error("Error saving event:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets an event by ID.
 */
export const getEventById = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets events by host ID.
 */
export const getEventsByHost = async (hostId: string) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("host_id", hostId);

    if (error) {
      console.error("Error fetching host events:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets events by location.
 */
export const getEventsByLocation = async (location: string) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("location", location);

    if (error) {
      console.error("Error fetching events by location:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets events by date.
 */
export const getEventsByDate = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("date", date);

    if (error) {
      console.error("Error fetching events by date:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets all assistants for an event.
 */
export const getAssistantsForEvent = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .select()
      .eq("event_id", eventId);

    if (error) {
      console.error("Error fetching assistants:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets events a user is assisting in.
 */
export const getEventsForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .select("event_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user events:", error);
      return { success: false, msg: error.message };
    }

    const eventIds = data.map((assistant) => assistant.event_id);
    
    if (eventIds.length === 0) return { success: true, data: [] };

    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select()
      .in("id", eventIds);

    if (eventsError) {
      console.error("Error fetching events for user:", eventsError);
      return { success: false, msg: eventsError.message };
    }

    return { success: true, data: events };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Subscribes a user to an event.
 */
export const subscribeToEvent = async (userId: string, eventId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .upsert({ user_id: userId, event_id: eventId, status, subscribed_at: new Date().toISOString() });

    if (error) {
      console.error("Error subscribing to event:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};
