import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (
  imagePath: string | null | undefined,
  bucket: string,
  folderPath = ""
) => {
  if (typeof imagePath === "string" && imagePath.startsWith("file://")) {
    return { uri: imagePath }; // Local image preview
  } else if (typeof imagePath === "string" && imagePath) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/public/${bucket}/${folderPath}/${imagePath}`,
    };
  } else {
    return require("../assets/images/defaultUser.png"); // Default image
  }
};export const getFileFromBucket = async (
  bucket: string,
  folderPath: string,
  filePath: string
) => {
  const fullPath = folderPath ? `${folderPath}/${filePath}` : filePath;

  try {
    // Generate a signed URL for the file
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(fullPath, 60); // Expires in 60 sec

    if (error) {
      throw error;
    }

    return { uri: data?.signedUrl }; // Return the signed URL
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    return null;
  }
};

export const uploadFile = async (
  bucket: string,
  fileUri: string,
  folderPath = ""
) => {
  try {
    const fileName = getFilePath(folderPath, fileUri);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imageData = decode(fileBase64);
    const mimeType = getMimeType(fileUri);

    let { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: true, // Allow overwriting existing images
        contentType: mimeType,
      });

    if (error) return { success: false, msg: error.message };

    // Return the full Supabase storage path
    const supabaseFilePath = `${folderPath}/${fileName}`;
    return { success: true, data: supabaseFilePath };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, msg: "Could not upload media" };
  }
};


export const getFilePath = (folderPath: string, fileUri: string) => {
  const ext = fileUri.split(".").pop() || "png"; // Extract file extension
  const timeStamp = new Date().getTime();
  return folderPath ? `${folderPath}/${timeStamp}.${ext}` : `${timeStamp}.${ext}`;
};

export const downloadFile = async (url: string) => {
  try {
    const localPath = getLocalFilePath(url);
    if (!localPath) throw new Error("Invalid file path");

    const { uri } = await FileSystem.downloadAsync(url, localPath);
    return uri;
  } catch (error) {
    console.error("File download error:", error);
    return null;
  }
};

export const getLocalFilePath = (filePath: string | null) => {
  if (!filePath) return null;
  const fileName = filePath.split("/").pop() || "default.png";
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const getMimeType = (fileUri: string) => {
  const ext = fileUri.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    mp4: "video/mp4",
    mov: "video/quicktime",
  };
  return mimeTypes[ext!] || "application/octet-stream";
};
