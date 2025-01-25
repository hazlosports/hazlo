import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "./Avatar";
import moment from "moment";
import { Trash } from "lucide-react-native";
import { Comment } from "@/app/(root)/(tabs)/(post)/postDetails";

interface CommentItemProps {
  item: {
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
  };
  canDelete?: boolean;
  onDelete?: (item: Comment) => void;
}

export function CommentItem({
  item,
  canDelete = false,
  onDelete = (item: Comment) => {},
}: CommentItemProps) {
  const createdAt = moment(item.created_at).format("MMM d");

  const handleDelete = () => {
    Alert.alert("Confirm", "Confirm delete comment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Avatar uri={item.user?.profileimage as string} size={32} />
      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{item.user.name}</Text>
            <Text style={{ color: "white" }}>·</Text>
            <Text style={[styles.text, { color: "gray" }]}>{createdAt}</Text>
          </View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Trash size={20} color="#FF6666" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },
  content: {
    backgroundColor: "#0E0E0E",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderCurve: "continuous",
    borderWidth: 0.5,
    borderColor: "#D9D9D9",
  },
  highlight: {
    borderWidth: 0.2,
    borderColor: "#D9D9D9",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "white",
  },
});
