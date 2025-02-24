import { View } from "react-native";
import SportsSection from "./SportSection";

export function UserProfile({ userId }: { userId: string }) {
  return (
    <View>
      <SportsSection userId={userId} />
    </View>
  );
}