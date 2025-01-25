import React, { forwardRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

// Extend the InputFieldProps to include TextInputProps
interface InputFieldProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
}

const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      containerStyle,
      labelStyle,
      label,
      placeholder,
      secureTextEntry = false,
      ...props
    }: InputFieldProps,
    ref
  ) => {
    return (
      <KeyboardAvoidingView
        style={{ width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, containerStyle]}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#888"
              autoCapitalize="none"
              secureTextEntry={secureTextEntry}
              ref={ref}
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
);

InputField.displayName = "InputField";

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%",
  },
  label: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#21242A",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#D9D9D9",
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    height: 45,
    width: "100%",
  },
});

export default InputField;
