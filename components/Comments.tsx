import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard } from "react-native";
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";

interface CommentsProps {
  postId: string; // The postId or eventId to identify the item
  isVisible: boolean; // Show or hide the panel
  toggleVisibility: () => void; // Function to toggle visibility
}

export default function Comments({ postId, isVisible, toggleVisibility }: CommentsProps) {
  const screenHeight = Dimensions.get("window").height; // Get the screen height
  const panelHeight = screenHeight * 0.6; // 60% of screen height
  const panelPosition = useSharedValue(isVisible ? 0 : screenHeight); // Initially hidden, adjust as per visibility

  const animatedPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(panelPosition.value, { damping: 20 }) }],
    height: isVisible ? panelHeight : 0, // Adjust panel height based on visibility
  }));

  // This will trigger visibility toggle
  useEffect(() => {
    if (isVisible) {
      panelPosition.value = 0;
    } else {
      panelPosition.value = screenHeight;
    }
  }, [isVisible]);

  // Function to handle press outside the panel to dismiss it
  const handleDismiss = () => {
    toggleVisibility(); // Hide the panel when outside is pressed
    Keyboard.dismiss(); // Dismiss the keyboard if open
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <View style={styles.panelContainer}>
        <Animated.View style={[styles.panel, animatedPanelStyle]}>
          <View style={styles.panelContent}>
            <Text style={styles.title}> Comments </Text> {/* Show postId or eventId */}
            <View style = {styles.sendCommentContainer}>
            <TextInput style={styles.commentInput} placeholder="Add a comment..." />
            <TouchableOpacity onPress={() => {}} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)", // Transparent background
    zIndex: 10, // Ensure it's on top of other content
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1f1f1f",
    padding :"2%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title :{ 
    borderTopColor : "gray",
    borderTopWidth :2,
    padding : "5%",
    alignSelf :"center",
    color  : "white",
    fontSize :16,
    fontWeight :"600"
  },
  panelContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  sendCommentContainer: {
    flexDirection : "row",
    alignItems :"center",
    backgroundColor: "#2f2f2f",
    padding: "4%",
    borderRadius : "6%"
},
  commentInput: {
    flex :1,
    borderRadius: 10,
  },
  sendButton: {
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
  },
});
