import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Postcard from "@/components/Postcard";
import {
  createPostComment,
  fetchPostDetails,
  removePostComment,
} from "@/services/postService";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "@/components/UI/Loading";
import InputField from "@/components/UI/InputField";
import { MessageSquareText } from "lucide-react-native";
import { CommentItem } from "@/components/UI/CommentItem";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";

export interface PostDetails {
  id: string;
  file: string;
  body: string;
  user: {
    id: string;
    avatar: string;
    username: string;
  };
  postLikes: {
    userId: string;
    postId: string;
  }[];
  comments: {
    id: string;
    text: string;
    userId: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      username: string;
      profileimage: string;
    };
  }[];
}
export interface Comment {
  id: string;
  text: string;
  userId: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileimage: string;
  };
}

export default function PostDetails() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<PostDetails | undefined>(undefined);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const commentRef = useRef("");

  const handleNewComment = async (payload: any) => {
    if (payload.new) {
      const newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        const updatedComments = prevPost.comments
          ? [...prevPost.comments, newComment]
          : [newComment];
        return {
          ...prevPost,
          comments: updatedComments,
        };
      });
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    setLoading(true);
    getPostDetails();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, [postId]);

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId as string);
    if (res.success && res.data) {
      setPost(res.data);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text
          style={{
            fontFamily: "Montserrat-Medium",
            fontSize: 20,
            color: "white",
          }}
        >
          Post Not Found!
        </Text>
      </View>
    );
  }

  const onNewComment = async () => {
    if (!commentRef.current || !user?.id) return null;
    let data = {
      userId: user.id,
      postId: postId as string,
      text: commentRef.current,
    };
    setCommentLoading(true);
    let res = await createPostComment(data);
    setCommentLoading(false);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg as any);
    }
  };

  const onDeleteCommment = async (comment: Comment) => {
    let res = await removePostComment(comment.id);
    if (res.success) {
      setPost((prevPost) => {
        if (!prevPost) return prevPost;

        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments?.filter(
          (c) => c.id !== comment.id
        );

        return updatedPost;
      });
    } else {
      Alert.alert("Comment", res.msg as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {post ? (
          <>
            <Postcard
              item={post}
              currentUser={user}
              router={router}
              showMoreIcon={false}
            />
            <View style={styles.inputContainer}>
              <InputField
                ref={inputRef}
                onChangeText={(value) => (commentRef.current = value)}
                placeholder="Type comment..."
                containerStyle={{ width: "80%" }}
              />
              {commentLoading ? (
                <View style={styles.iconContainer}>
                  <Loading />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={onNewComment}
                  style={styles.iconContainer}
                >
                  <MessageSquareText size={24} color={"white"} />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ marginVertical: 15, gap: 17 }}>
              {post.comments.map((comment) => (
                <CommentItem
                  item={comment}
                  key={comment?.id.toString()}
                  canDelete={
                    user!.id === comment.userId || user!.id === post.user.id
                  }
                  onDelete={onDeleteCommment}
                />
              ))}
              {post.comments.length === 0 && (
                <Text
                  style={{
                    fontFamily: "Montserrat-Medium",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Be the first to comment!
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text>Not Found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    padding: 5,
    backgroundColor: "#0E0E0E",
    height: "100%",
  },
  center: {
    gap: 10,
    marginBottom: 15,
    padding: 5,
    backgroundColor: "#0E0E0E",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    width: "100%",
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 25,
    top: "65%",
    transform: [{ translateY: -12 }],
  },
});
