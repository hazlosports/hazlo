import { supabase } from "@/lib/supabase";
  
export type Location = {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
};

/**
 * Creates or updates a location.
 */
export const createOrUpdateLocation = async (location: Partial<Location>) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .upsert(location)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets a location by ID.
 */
export const getLocationById = async (locationId: string) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select()
      .eq("id", locationId)
      .maybeSingle();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Searches for locations by name.
 */
export const getLocationsByName = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select()
      .ilike("name", `%${name}%`);

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};

/**
 * Gets all locations within a certain distance.
 */
export const getLocationsNearby = async (
  latitude: number,
  longitude: number,
  radiusInKm: number
) => {
  try {
    const { data, error } = await supabase.rpc("get_locations_within_radius", {
      lat: latitude,
      lon: longitude,
      radius: radiusInKm,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error:", error);
    return { success: false, msg: error.message };
  }
};
