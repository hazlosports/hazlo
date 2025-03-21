import { ImagePickerAsset } from "expo-image-picker";
import { uploadFile } from "./imageService";
import { supabase } from "@/lib/supabase";

// Post interface definition
export interface Post {
  id: string;
  body: string;
  file?: string; // The file URL (image/video URL)
  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  reactions: {
    likes_count: number;
    comments_count: number;
  };
  created_at?: string;
}
export interface PostLike {
  userId: string;
  postId: string;
}

export interface PostComment {
  id: string;
  userId: string;
  postId: string;
  text: string;
}

// Create or update a post
export async function createOrUpdatePost(post: Post) {
  try {
    if (!post.user.id || !post.body) {
      console.warn("Invalid post data: Missing userId or body.");
      return { success: false, msg: "Invalid post data." };
    }

    // Upload Image or Video if file is provided
    if (post.file && post.file.startsWith('file://')) {
      const isImage = post.file.includes("image");
      const folderName = isImage ? "postImages" : "postVideos";

      const fileResult = await uploadFile("uploads", post.file, folderName);
      if (!fileResult.success) {
        console.error("File upload failed:", fileResult.msg);
        return fileResult;
      }

      // Make sure post.file is assigned a string (either the result or an empty string if undefined)
      post.file = fileResult.data || ""; // Fallback to empty string if undefined
    }

    // Insert or update post
    const { data, error } = await supabase.from("posts").upsert(post).select().single();

    if (error) {
      console.error("Post Error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error in createOrUpdatePost:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Fetch posts from followed users
export async function fetchPosts(currentUserId: string, limit: number = 10) {
  try {
    if (!currentUserId) {
      console.warn("fetchPosts called without a valid user ID.");
      return { success: false, msg: "User ID is required." };
    }

    // Get followed users
    const { data: followedUsers, error: followError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", currentUserId);

    if (followError) {
      console.error("Followers Fetch Error:", followError);
      return { success: false, msg: followError.message };
    }

    const followedUserIds = followedUsers?.map((f: any) => f.followed_id) || [];

    if (followedUserIds.length === 0) {
      console.warn("No followed users found.");
      return { success: true, data: [] };
    }

    // Fetch posts from followed users
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user: users(id, username, avatar), postLikes(user_id, post_id), comments(id)`
      )
      .in("user_id", followedUserIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Fetch Posts Error:", error);
      return { success: false, msg: error.message };
    }

    if (!data || data.length === 0) {
      console.warn("No posts found.");
      return { success: true, data: [] };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error in fetchPosts:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Create a like for a post
export async function createPostLike(postLike: PostLike) {
  try {
    if (!postLike.userId || !postLike.postId) {
      console.warn("Invalid like data: Missing userId or postId.");
      return { success: false, msg: "Invalid like data." };
    }

    const { data, error } = await supabase.from("postLikes").insert(postLike).select().single();

    if (error) {
      console.error("Like Error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error in createPostLike:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Remove a like from a post
export async function removePostLike(postId: string, userId: string) {
  try {
    if (!postId || !userId) {
      console.warn("Invalid unlike request: Missing userId or postId.");
      return { success: false, msg: "Invalid unlike request." };
    }

    const { error } = await supabase.from("postLikes").delete().eq("userId", userId).eq("postId", postId);

    if (error) {
      console.error("Unlike Error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, msg: "Like removed successfully." };
  } catch (error: any) {
    console.error("Unexpected Error in removePostLike:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Fetch post details
export async function fetchPostDetails(postId: string) {
  try {
    if (!postId) {
      console.warn("fetchPostDetails called without a valid postId.");
      return { success: false, msg: "Post ID is required." };
    }

    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user: users(id, username, avatar), postLikes(user_id, post_id), comments(id, text, user_id, created_at, user: users(id, name, username, avatar))`
      )
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Fetch PostDetails Error:", error.message);
      return { success: false, msg: error.message };
    }

    if (!data) {
      console.warn("No data found for the given postId.");
      return { success: false, msg: "No post found." };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error in fetchPostDetails:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Create a comment for a post
export async function createPostComment(postComment: PostComment) {
  try {
    if (!postComment.userId || !postComment.postId || !postComment.text) {
      console.warn("Invalid comment data: Missing userId, postId, or text.");
      return { success: false, msg: "Invalid comment data." };
    }

    const { data, error } = await supabase.from("comments").insert(postComment).select().single();

    if (error) {
      console.error("Comment Error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected Error in createPostComment:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}

// Remove a comment from a post
export async function removePostComment(commentId: string) {
  try {
    if (!commentId) {
      console.warn("removePostComment called without a valid commentId.");
      return { success: false, msg: "Comment ID is required." };
    }

    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      console.error("Comment Deletion Error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data: commentId };
  } catch (error: any) {
    console.error("Unexpected Error in removePostComment:", error);
    return { success: false, msg: error.message || "An unknown error occurred." };
  }
}
