import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import CreateEvent from "@/components/CreateEvent";
import { SafeAreaProvider } from "react-native-safe-area-context";

const COMPONENTS: Record<string, { component: React.ComponentType; title: string }> = {
  newEvent: { component: CreateEvent, title: "Create Event" },
};

const ActionScreen = () => {
  const { component } = useLocalSearchParams();
  const router = useRouter();
  const SelectedComponent = COMPONENTS[component as string]?.component;
  const title = COMPONENTS[component as string]?.title || "Unknown";

  return (
    <SafeAreaProvider style = {{flex : 1}}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.crossButton}>
            <X color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
        <LinearGradient colors={["red", "blue"]} style={styles.gradientBorder} />
      </View>
      <View style={styles.componentContainer}>
        {SelectedComponent ? <SelectedComponent /> : null}
      </View>
    </SafeAreaProvider>    
  );
};

export default ActionScreen;

const styles = StyleSheet.create({
  header: {
    flex : .2,
    alignItems: "stretch",
    justifyContent : "flex-end",
    backgroundColor : "black"
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent : "space-between",
  },
  crossButton: {
    padding: "5%",
    alignSelf : "flex-start"
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  gradientBorder: {
    height: 10,
    width: "100%",
    alignSelf :"flex-end"
  },
  componentContainer : {
    flex  :.8,
  }
});
