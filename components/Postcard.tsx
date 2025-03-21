import { User } from "@/context/AuthContext";
import { Router } from "expo-router";
import {
  Ellipsis,
  Loader2,
  MessageSquareText,
  Send,
  ThumbsUp,
} from "lucide-react-native";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { Avatar } from "./UI/Avatar";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getFileFromBucket } from "@/services/imageService";
import { ResizeMode, Video } from "expo-av";
import { Post, createPostLike, removePostLike } from "@/services/postService";
import { useEffect, useState } from "react";
import { stripHtmlTags } from "@/lib/helper";

interface PostcardProps {
  item: Post;
  currentUser: User | null;
  router: Router;
  showMoreIcon?: boolean;
  onCommentPress?: () => void;  // Callback to handle comment button press
}

const tagStyles = {
  h1: { color: "white", fontFamily: "Montserrat-Bold" },
  h4: { color: "white", fontFamily: "Montserrat-Medium" },
  div: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
  b: { color: "white", fontSize: 16, fontFamily: "Montserrat-Bold" },
  p: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
  ul: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
  ol: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
};

export default function Postcard({
  item,
  currentUser,
  router,
  showMoreIcon = true,
  onCommentPress,  // Accept the callback prop
}: PostcardProps) {
  const [folderPath, fileName] = item.file ? item.file.split("/") : ["", ""];
  const [fileUri, setFileUri] = useState<{ uri: string } | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(item.reactions.likes_count);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(false); // Reset state
    if (currentUser) {
      // No direct way to check if user liked, so assume false initially
      // If you later store liked state in the backend, update this logic
    }
  }, [item, currentUser]);

  const onLike = async () => {
    if (!currentUser) return;

    if (liked) {
      setLikeCount((prev) => Math.max(0, prev - 1));
      setLiked(false);
      const res = await removePostLike(item.id, currentUser.id);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
      const res = await createPostLike({ userId: currentUser.id, postId: item.id });
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      }
    }
  };

  const onShare = async () => {
    const content: { message: string; url?: string } = {
      message: stripHtmlTags(item.body),
    };

    if (item.file) {
      setLoading(true);
      if (fileUri && fileUri.uri) {
        const url = await downloadFile(fileUri.uri);
        if (url) {
          content.url = url;
        }
      }
    }
    setLoading(false);
    Share.share(content);
  };

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const openPostDetails = () => {
    if (!showMoreIcon) return;
    router.push({ pathname: "/postDetails", params: { postId: item.id } });
  };

  useEffect(() => {
    const fetchFileUri = async () => {
      if (!folderPath || !fileName) return;
      const uri = await getFileFromBucket("uploads", folderPath, fileName);
      if (uri) {
        setFileUri(uri);
        setLoading(false);
      }
    };

    fetchFileUri();
  }, [folderPath, fileName]);

  const onImageLoad = (event: any) => {
    const { height } = event.nativeEvent.source;
    setImageHeight(height);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={40} uri={item.user.avatar || ""} style={{ borderWidth: 0.5, borderColor: "#1e1e1e" }} />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Ellipsis size={22} color={"white"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Post Content */}
      <View style={styles.postBody}>
        <RenderHtml contentWidth={100} source={{ html: item.body }} tagsStyles={tagStyles} />
      </View>

      {/* Media */}
      {item.file && (
        <View style={styles.content}>
          {folderPath === "postImages" && (
            <Image
              source={loading ? require("@/assets/images/defaultBanner.png") : fileUri}
              transition={100}
              style={[styles.postMedia, { height: Math.min(imageHeight || 200, 200) }]}
              contentFit="cover"
              onLoad={onImageLoad}
            />
          )}
          {folderPath === "postVideos" && fileUri && !loading && (
            <Video
              style={styles.postMedia}
              source={{ uri: fileUri.uri }}
              useNativeControls
              isLooping
              resizeMode={ResizeMode.COVER}
            />
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike} style={styles.footerButton}>
          <ThumbsUp size={26} color={liked ? "#FF3333" : "white"} />
          <Text style={styles.footerText}>{likeCount}</Text>
        </TouchableOpacity>

        {/* Comment Button and Count */}
        <TouchableOpacity onPress={onCommentPress} style={styles.footerButton}>
          <MessageSquareText size={26} color={"white"} />
          <Text style={styles.footerText}>{item.reactions.comments_count}</Text>
        </TouchableOpacity>

        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Loader2 size={26} color={"white"} />
          </Animated.View>
        ) : (
          <TouchableOpacity onPress={onShare}>
            <Send size={26} color={"white"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    borderBottomWidth: 0.5,
    borderColor: "#1e1e1e",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  userName: {
    color: "white",
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
  },
  content: {
    gap: 10,
  },
  postBody: {},
  postMedia: {
    width: "100%",
    borderRadius: "2%",
    borderWidth: 0.5,
    borderColor: "#1e1e1e",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "5%",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
  },
  footerText: {
    color: "white",
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    paddingHorizontal: "2%",
  },
});
