import { supabase } from '@/lib/supabase';
import { Post } from './postService';
import { HazloEvent } from './eventService';

export type FeedItem = {
  type: 'post' | 'event';
  data: Post | HazloEvent;
};

// Define the response shape returned by the `rpc` call
export type GetFeedResponse = FeedItem[];


export const getFeed = async (
  userId: string,
  cursor: string | null = null
) => {
  console.log('Fetching feed for user:', userId); // Log the user ID for which we are fetching the feed

  // Log the cursor value if it's provided
  if (cursor) {
    console.log('Using cursor for pagination:', cursor);
  }

  const { data, error } = await supabase
    .rpc('get_feed', { user_id: userId, cursor });

  // Log the error if it exists
  if (error) {
    console.error('Error fetching feed:', error.message);
    throw new Error(error.message);
  }

  // Log the raw data response
  console.log('Raw feed data received:', data);

  // Cast the `data` to the expected response type
  const feedData = data as GetFeedResponse; 

  // Log the feed content
  console.log('Processed feed data:', feedData);

  return feedData || []; // Return the feed or an empty array if not available
};
