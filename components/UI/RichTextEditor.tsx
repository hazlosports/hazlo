import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  actions,
  RichToolbar,
  RichEditor,
} from "react-native-pell-rich-editor";

interface RichTextEditorProps {
  editorRef: React.RefObject<RichEditor>;
  onChange: (text: string) => void;
}

export default function RichTextEditor({
  editorRef,
  onChange,
}: RichTextEditorProps) {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.insertLink,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: { tintColor: string }) => (
            <Text style={{ color: tintColor }}>H4</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.listStyle}
        selectedIconTint={"#0EA8F5"}
        editor={editorRef}
        disabled={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder={"What's on your mind?"}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    backgroundColor: "#21242A",
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
  },
  listStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
  rich: {
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopWidth: 0,
    backgroundColor: "#21242A",
    borderColor: "#D9D9D9",
    borderWidth: 0.5,
    minHeight: 240,
    padding: 5,
    flex: 1,
  },
  contentStyle: {
    color: "white",
    backgroundColor: "#21242A",
  },
});
