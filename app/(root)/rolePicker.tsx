import { View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RolePicker from "@/components/RolePicker";
import { Logo } from "@/components/UI/Logo";

export default function SportPicker() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} />
        <Logo containerStyle={{ height: "10%" }} />
        <RolePicker/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0E0E0E",
  },
  container: {
    flex: 1,
  },
  screenContainer: {
    paddingVertical : "5%",
    flex: 1,
    justifyContent : "flex-start",
    // backgroundColor : "orange",

  },
  usernameScreenContainer: {
    flex: 1,
    justifyContent : "space-between",
    // Ensures this view expands to take available space
  },
  welcome: {
  },
  welcomeHeader: {
    color: "white",
    fontSize: 24,
    fontFamily: "Montserrat-ExtraBold",
  },
  welcomeSubHeader: {
    color: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  inputField : {
    alignSelf : "flex-start"
  },
  skipButton : {
    padding : "5%",
    alignSelf : "center"
  }
});
