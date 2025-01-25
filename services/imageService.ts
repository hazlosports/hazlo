import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (imagePath: string | null | undefined) => {
  if (typeof imagePath === "string" && imagePath.startsWith("file://")) {
    // Local URI, likely from the image picker
    return { uri: imagePath };
  } else if (typeof imagePath === "string" && imagePath) {
    // Remote URI, likely from Supabase storage
    return getFileFromBucket(imagePath);
  } else {
    // Default placeholder image
    return require("../assets/images/defaultUser.png");
  }
};

export const getFileFromBucket = (filePath: string) => {
  if (filePath) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64);

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    if (error) return { success: false, msg: error };

    return { success: true, data: data?.path };
  } catch (error) {
    console.log("File upload error: ", error);
    return { success: false, msg: "Could not upload media" };
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};

export const downloadFile = async (url: string) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

export const getLocalFilePath = (filePath: string) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};
