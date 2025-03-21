import { supabase } from "@/lib/supabase";

// Define the type for the Pack object
export type Pack = {
  coach_id: string;
  name: string;
  tier: number;
  price: number;
  benefits: string[];  // List of benefits
};

/**
 * Fetches packs for a given coach from Supabase.
 */
export const getPacksByCoachId = async (coachId: string) => {
  const { data, error } = await supabase
    .from("packs")
    .select()
    .eq("coach_id", coachId);

  if (error) return { success: false, msg: error.message };
  return { success: true, data };
};

/**
 * Creates a new pack (without an id as it will be auto-generated).
 */
export const createPack = async (pack: Omit<Pack, 'id'>) => {
  const { data, error } = await supabase
    .from("packs")
    .insert([pack]) // Insert new pack, Supabase generates the id
    .single();

  if (error) return { success: false, msg: error.message };
  return { success: true, data };
};

/**
 * Updates an existing pack by id.
 */
export const updatePack = async (id: string, updatedData: Partial<Pack>) => {
  const { data, error } = await supabase
    .from("packs")
    .update(updatedData) // Update only the fields in updatedData
    .eq("id", id) // Only update the pack with the given id
    .single();

  if (error) return { success: false, msg: error.message };
  return { success: true, data };
};

/**
 * Deletes a pack by id.
 */
export const deletePack = async (id: string) => {
  const { error } = await supabase
    .from("packs")
    .delete()
    .eq("id", id);

  if (error) return { success: false, msg: error.message };
  return { success: true, msg: "Pack deleted successfully." };
};
