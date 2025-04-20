import { supabase } from '@/lib/supabase';
import { HazloEvent } from './eventService';

export type MapLocation = {
  lat: number;
  long: number;
  name?: string;
  address?: string;
};

export type MapItem =
  | { location: MapLocation; type: HazloEvent }

export type GetMapItemsResponse = MapItem[];

export const getMapItemsByBounds = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number
) => {
  console.log('Fetching map items within bounds:', {
    minLat,
    maxLat,
    minLng,
    maxLng,
  });

  const { data, error } = await supabase.rpc('get_map_by_bounds', {
    min_lat: minLat,
    max_lat: maxLat,
    min_lng: minLng,
    max_lng: maxLng,
  });

  if (error) {
    console.error('Error fetching map items:', error.message);
    throw new Error(error.message);
  }

  const mapItems = data as GetMapItemsResponse;

  console.log('Map items fetched:', mapItems);

  return mapItems || [];
};


