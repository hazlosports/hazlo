import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";

import React, { useRef, useState } from "react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ImageIcon, Trash, X } from "lucide-react-native";
import { router } from "expo-router";
import { Button } from "@/components/UI/Button";
import RichTextEditor from "@/components/UI/RichTextEditor";
import * as ImagePicker from "expo-image-picker";
import { getFileFromBucket } from "@/services/imageService";
import { ResizeMode, Video } from "expo-av";
import { useAuth } from "@/context/AuthContext";
import { createOrUpdatePost } from "@/services/postService";

export default function Post() {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>();

  const onPick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access media library is required to select a profile image."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Image Picker Error: ", error);
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const getFileUri = (file: ImagePicker.ImagePickerAsset) => {
    try {
      if (!file) return null;
      if (isLocalFile(file)) {
        return file.uri;
      }
      return getFileFromBucket(file.uri)?.uri;
    } catch (error) {
      console.error("File URI Error: ", error);
      return null;
    }
  };

  const isLocalFile = (file: ImagePicker.ImagePickerAsset) => {
    try {
      if (!file) return null;
      return typeof file === "object";
    } catch (error) {
      console.error("File Check Error: ", error);
      return false;
    }
  };

  const getFileType = (file: ImagePicker.ImagePickerAsset) => {
    try {
      if (!file) return null;
      if (isLocalFile(file)) {
        return file.type;
      }

      if (file.uri.includes("postImages")) {
        return "image";
      }
      return "video";
    } catch (error) {
      console.error("File Type Error: ", error);
      return null;
    }
  };

  const onSubmit = async () => {
    try {
      if (!bodyRef.current || !file || !user?.id) {
        Alert.alert("Post", "Please choose a media and body");
        return;
      }

      let data = {
        postData: {
          file,
          body: bodyRef.current,
          userId: user?.id,
        },
      };

      console.log(user.id);

      setLoading(true);
      let res = await createOrUpdatePost(data);
      setLoading(false);

      if (res?.success) {
        setFile(null);
        bodyRef.current = "";
        editorRef.current = null;
        router.replace("/(root)/(tabs)/home");
      } else {
        Alert.alert("Post", res?.msg || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Post Submission Error: ", error);
      Alert.alert("Error", "Failed to create post.");
    }
  };

  return (
    <ScreenWrapper bg="#0E0E0E" style={{ paddingHorizontal: 20 }}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(root)/(tabs)/home")}>
          <X size={24} color={"white"} />
        </TouchableOpacity>
        <Button
          title="Share"
          size="medium"
          loading={loading}
          onPress={onSubmit}
        />
      </View>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>New Post</Text>
        <LinearGradient
          colors={["#0EA8F5", "#692EF8"]}
          style={styles.titleGradient}
        />
      </View>
      <ScrollView contentContainerStyle={{ gap: 20, marginTop: 20 }}>
        <RichTextEditor
          editorRef={editorRef}
          onChange={(body) => (bodyRef.current = body)}
        />
        {file && getFileUri(file) && (
          <View style={styles.file}>
            {getFileType(file) === "video" ? (
              <Video
                style={{ flex: 1 }}
                source={{ uri: getFileUri(file) as string }}
                useNativeControls
                isLooping
                resizeMode={ResizeMode.COVER}
                onError={(error) => {
                  console.error("Video Load Error: ", error);
                  Alert.alert("Error", "Failed to load video.");
                }}
              />
            ) : (
              <Image
                source={{ uri: getFileUri(file) as string }}
                resizeMode="cover"
                style={{ flex: 1 }}
                onError={() => {
                  console.error("Image Load Error");
                  Alert.alert("Error", "Failed to load image.");
                }}
              />
            )}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setFile(null)}
            >
              <Trash size={16} color={"white"} />
            </TouchableOpacity>
          </View>
        )}

        {/* Media Section */}
        <LinearGradient
          colors={["#0EA8F5", "#692EF8"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.mediaGradient}
        >
          <View style={styles.media}>
            <Text style={styles.mediaText}>Add Media</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={onPick}>
                <ImageIcon size={30} color={"#D9D9D9"} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 25,
    gap: 3,
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "white",
  },
  titleGradient: {
    width: 100,
    height: 2,
    borderRadius: 5,
  },
  file: {
    width: "100%",
    height: "50%",
    borderRadius: 14,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  mediaGradient: {
    borderRadius: 16,
    padding: 1,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0E0E0E",
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  mediaText: {
    fontFamily: "Montserrat-Medium",
    color: "white",
    fontSize: 14,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,0,0,0.4)",
    padding: 7,
    borderRadius: 50,
  },
});
