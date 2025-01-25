import { ImagePickerAsset } from "expo-image-picker";
import { uploadFile } from "./imageService";
import { supabase } from "@/lib/supabase";
import { Post } from "@/components/Postcard";

export interface PostData {
  postData: {
    file: ImagePickerAsset | string | undefined;
    body: string;
    userid: string;
  };
}

export interface PostLike {
  userId: string;
  postId: string;
}

export interface PostComment {
  userId: string;
  postId: string;
  text: string;
}

export async function createOrUpdatePost({ postData }: PostData) {
  try {
    // Upload Image
    if (typeof postData.file == "object") {
      let isImage = postData.file.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadFile(folderName, postData.file.uri, isImage);
      if (fileResult.success) postData.file = fileResult.data;
      else {
        return fileResult;
      }

      const { data, error } = await supabase
        .from("posts")
        .upsert(postData)
        .select()
        .single();

      if (error) {
        console.log("Post Error: ", error);
        return { success: false, msg: error };
      }

      return { success: true, data: data };
    }
  } catch (error: any) {
    console.log("Post Error: ", error);
    return { success: false, msg: error };
  }
}

export async function fetchPosts(currentUserId: string, limit: number = 10) {
  try {
    const { data: followedUsers, error: followError } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", currentUserId);

    if (followError) {
      console.log("Followers Error: ", followError);
      return { success: false, msg: followError.message };
    }

    const followedUserIds =
      followedUsers?.map((followedUser: any) => followedUser.followed_id) || [];
    followedUserIds.push(currentUserId);

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user: users(id, username, profileimage),
        postLikes(userId, postId),
        comments(id)
        `
      )
      .in("userid", followedUserIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("Fetch Error: ", error);
      return { success: false, msg: error.message };
    }

    const posts: Post[] =
      data?.map((post: any) => ({
        id: post.id,
        file: post.file || "",
        body: post.body || "",
        userid: post.userid,
        user: post.user || {},
        postLikes: post.postLikes || [],
        comments: post.comments || [],
      })) || [];

    return { success: true, data: posts };
  } catch (error) {
    return { success: false, msg: error as any };
  }
}

export async function createPostLike(postLike: PostLike) {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("Like Error: ", error);
      return { success: false, msg: error };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Like Error: ", error);
    return { success: false, msg: error };
  }
}

export async function removePostLike(postId: string, userId: string) {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("Like Error: ", error);
      return { success: false, msg: error };
    }
    return { success: true, msg: "Updated correctly!" };
  } catch (error) {
    console.log("Like Error: ", error);
    return { success: false, msg: error };
  }
}

export async function fetchPostDetails(postId: string) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user: users(id, username, profileimage),
        postLikes(userId, postId),
        comments(
          id,
          text,
          userId,
          created_at,
          user: users(id, name, username, profileimage)
        )
        `
      )
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Fetch PostDetails Error: ", error.message);
      return { success: false, msg: error.message };
    }

    if (!data) {
      console.warn("No data found for the given postId.");
      return { success: false, msg: "No post found." };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected Error in fetchPostDetails:", err);
    return { success: false, msg: err.message || "An unknown error occurred." };
  }
}

export async function createPostComment(postComment: PostComment) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(postComment)
      .select()
      .single();

    if (error) {
      console.log("Comment Error: ", error);
      return { success: false, msg: error };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Comment Error: ", error);
    return { success: false, msg: error };
  }
}

export async function removePostComment(commentId: string) {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("Comment Error: ", error);
      return { success: false, msg: error };
    }
    return { success: true, data: commentId };
  } catch (error) {
    console.log("Comment Error: ", error);
    return { success: false, msg: error };
  }
}
