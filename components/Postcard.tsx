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
import { Avatar } from "./Avatar";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getFileFromBucket } from "@/services/imageService";
import { ResizeMode, Video } from "expo-av";
import { createPostLike, removePostLike } from "@/services/postService";
import { useEffect, useState } from "react";
import { stripHtmlTags } from "@/lib/helper";

export interface Post {
  id: string;
  file: string;
  body: string;
  userid: string;
  user: {
    id: string;
    profileimage: string;
    username: string;
  };
  postLikes: {
    userId: string;
    postId: string;
  }[];
  comments: { id: string }[];
}

interface PostcardProps {
  item: Post;
  currentUser: User | null;
  router: Router;
  showMoreIcon?: boolean;
}

const tagStyles = {
  h1: { color: "white", fontFamily: "Montserrat-Bold" },
  h4: { color: "white", fontFamily: "Montserrat-Medium" },
  div: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  b: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },
  p: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
  ul: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
  ol: { color: "white", fontSize: 16, fontFamily: "Montserrat-Regular" },
};

export default function Postcard({
  item,
  currentUser,
  router,
  showMoreIcon = true,
}: PostcardProps) {
  const videoUri = getFileFromBucket(item.file);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState<{ userId: string }[]>([]);
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  const onLike = async () => {
    if (liked) {
      const updatedLikes = likes.filter(
        (like) => like.userId !== currentUser?.id
      );
      setLikes(updatedLikes);
      const res = await removePostLike(item.id, currentUser!.id as string);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
        setLikes([...likes]);
      }
    } else {
      const data = { userId: currentUser!.id as string, postId: item.id };
      setLikes([...likes, data]);
      const res = await createPostLike(data);
      if (!res.success) {
        Alert.alert("Post", "Something went wrong!");
        setLikes(likes);
      }
    }
  };

  useEffect(() => {
    setLikes(item.postLikes);
  }, [item.postLikes]);

  const onShare = async () => {
    const content: { message: string; url?: string } = {
      message: stripHtmlTags(item.body),
    };

    if (item.file) {
      setLoading(true);
      const file = getFileFromBucket(item.file);

      if (file && file.uri) {
        const url = await downloadFile(file.uri);
        if (url) {
          content.url = url;
        }
      }
    }
    setLoading(false);
    Share.share(content);
  };

  const spinValue = new Animated.Value(0);

  // Define spinning animation
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
    if (!showMoreIcon) return null;
    router.push({ pathname: "/postDetails", params: { postId: item.id } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={40} uri={item.user.profileimage} />
          <Text style={styles.userName}>{item.user.username}</Text>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Ellipsis size={28} color={"white"} />
          </TouchableOpacity>
        )}
      </View>
      {/* Post Info */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          <RenderHtml
            contentWidth={100}
            source={{ html: item.body }}
            tagsStyles={tagStyles}
          />
        </View>
        {/* Image */}
        {item.file.includes("postImages") && (
          <Image
            source={getFileFromBucket(item.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {/* Video */}
        {item.file.includes("postVideos") && (
          <Video
            style={styles.postMedia}
            source={videoUri ? { uri: videoUri.uri } : undefined}
            useNativeControls
            isLooping
            resizeMode={ResizeMode.COVER}
          />
        )}
      </View>
      {/* Post Actions */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <ThumbsUp size={24} color={liked ? "#FF3333" : "white"} />
          </TouchableOpacity>
          <Text style={styles.footerText}>{likes.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <MessageSquareText size={24} color={"white"} />
          </TouchableOpacity>
          <Text style={styles.footerText}>{item.comments.length || 0}</Text>
        </View>
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Loader2 size={24} color={"white"} />
          </Animated.View>
        ) : (
          <TouchableOpacity onPress={onShare}>
            <Send size={24} color={"white"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    padding: 5,
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
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 25,
    marginLeft: 10,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: "white",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
});
